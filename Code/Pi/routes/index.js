const express = require('express');
const router = express.Router();

// Postgresness
const { Pool, Client } = require('pg');

// GET home page
router.get('/', async function(req, res, next) {
  res.render('index', { title: 'Home' });
});


// GET sensor data
router.get('/sdata', async function(req,res) {
    const client = new Pool({
        user: 'pi',
        host: 'localhost',
        database: 'test',
        password: process.env.PGPASSWORD, // So the db pass isn't on github
        port: 5432,
    });

    console.log(req.query.start, req.query.end);

    let getDataQuery = {
        name: 'getData',
        text: 'SELECT * FROM sensors WHERE dtime BETWEEN $1 AND $2',
        values: [req.query.start, req.query.end]
    };

    client.query(getDataQuery).then(resp => {
        if (resp.rows.length < 1){
            client.end();
            console.log("couldn't send sensor data");
            return res.json({ success: false, msg: 'Database read error' });
        }

        client.end();
        return res.json({ success: true, data: resp.rows });
    }).catch(function (error) {
        console.error(error);
    })

});


// GET weather data
router.get('/wdata', async function(req,res){
    const client = new Pool({
        user: 'pi',
        host: 'localhost',
        database: 'test',
        password: process.env.PGPASSWORD,
        port: 5432,
    });

    let getDataQuery = {
        name: 'getWData',
        text: 'SELECT * FROM weather WHERE dtime BETWEEN $1 AND $2',
        values: [req.query.start, req.query.end]
    };

    client.query(getDataQuery).then(resp => {
        if (resp.rows.length < 1){
            client.end();
            console.log("couldn't send weather data");
            return res.json({ success: false, msg: 'Database read error' });
        }

        client.end();
        return res.json({ success: true, data: resp.rows })
    }).catch((err)=>{
        console.error(err);
    })
});

// GET settings values
router.get('/settings', async function(req,res){
    // Return vals from db
    const client = new Pool({
        user: 'pi',
        host: 'localhost',
        database: 'test',
        password: process.env.PGPASSWORD,
        port: 5432,
    });

    let getDataQuery = {
        name: 'getSettings',
        text: 'SELECT * FROM profile',
    };

    client.query(getDataQuery).then(resp => {
        if (resp.rows.length < 1){
            client.end();
            return res.json({ success: false, msg: 'Database read error' });
        }

        client.end();
        return res.json({ success: true, data: resp.rows })

    }).catch((err)=>{
        console.error(err);
    })
});

let validateThresh = function(thresholds){
    // This takes the values (whatever they may be) from the client's post request and processes them,
    // A combination of validation and type conversion. (Args are just shorthand for threshold names.)

    const allowedVals = {
        tempLOWER: {
            "10&deg;C": true,
            "8&deg;C": true,
            "5&deg;C": true,
            "3&deg;C": true,
            "0&deg;C": true,
        },
        tempUPPER: {
            "20&deg;C": true,
            "23&deg;C": true,
            "25&deg;C": true,
            "28&deg;C": true,
            "30&deg;C": true,
        },
        lightLOWER: {
            "10%": true,
            "15%": true,
            "20%": true,
        },
        lightUPPER: {
            "35%":true,
            "40%":true,
            "45%":true,
            "50%":true,
        },
        soilLOWER: {
            "50%":true,
            "55%":true,
            "60%":true,
        },
        soilUPPER: {
            "60%": true,
            "65%": true,
            "70%": true,
            "75%": true,
        },
        humidity: {
            "85RH":true,
            "88RH":true,
            "90RH":true,
            "93RH":true,
            "95RH":true,
        }
    };

    let allowedVals_tL = ["10°C", "8°C", "5°C", "3°C", "0°C"];
    let allowedVals_tU = ["20°C", "23°C", "25°C", "28°C", "30°C"];
    let allowedVals_lL = ["10%", "15%", "20%"];
    let allowedVals_lU = ["35%", "40%", "45%", "50%"];
    let allowedVals_sL = ["50%", "55%", "60%"];
    let allowedVals_sU = ["60%", "65%", "70%", "75%"];
    let allowedVals_h = ["85RH", "88RH", "90RH", "93RH", "95RH"];
    //
    if (!allowedVals_tL.includes(thresholds.tempLOWER) || !allowedVals_tU.includes(thresholds.tempUPPER) ||!allowedVals_lL.includes(thresholds.lightLOWER) ||!allowedVals_lU.includes(thresholds.lightUPPER) ||!allowedVals_sL.includes(thresholds.soilLOWER) ||!allowedVals_sU.includes(thresholds.soilUPPER) ||!allowedVals_h.includes(thresholds.humidity)){
        // Bad value given, return empty
        return [];
    }else{
        // Past this point all the arguments given by the client are within the allowed set
        // Time to convert into ints for db insert
        let returnVals = [];

        returnVals[0] = parseInt(thresholds.tempLOWER.split("&")[0]); // removes extra fluff and gets val as int
        returnVals[1] = parseInt(thresholds.tempUPPER.split("&")[0]);
        returnVals[2] = parseInt(thresholds.lightLOWER.split("%")[0]);
        returnVals[3] = parseInt(thresholds.lightUPPER.split("%")[0]);
        returnVals[4] = parseInt(thresholds.soilLOWER.split("%")[0]);
        returnVals[5] = parseInt(thresholds.soilUPPER.split("%")[0]);
        returnVals[6] = parseInt(thresholds.humidity.split("RH")[0]);

        console.log("validated vals:");
        console.log(returnVals);

        return returnVals;
    }

    // for (let i in thresholds){
    //     // Checks if the arg vals given are within allowedVals
    //     if (thresholds.hasOwnProperty(i)) {
    //         if (!allowedVals[i].hasOwnProperty(thresholds[i])) {
    //             return [];
    //         }
    //     }else{
    //         return [];
    //     }
    // }


};

let validateCustom = function(customProfile){

};

// Profile setting
router.post('/normal', function (req,res) {
    // validation and conversion
    let thresholds = validateThresh(req.body.thresholds);

    console.log("thresholds:");
    console.log(thresholds);

    if (thresholds === []){
        console.log("bad threshold input");
    }else{
        const client = new Pool({
            user: 'pi',
            host: 'localhost',
            database: 'test',
            password: process.env.PGPASSWORD,
            port: 5432,
        });

        let query = {
            text: 'insert into profile values(\'Normal\', 2, 16, 2, 4, 1, 1, $1, $2, $3, $4, $5, $6, $7)',
            values: thresholds,
        };

        client.query(query, (err, res) => {
            if (err) throw err;
            console.log(res);
            client.end()
        })
    }
});
router.post('/hot', function (req,res) {
    // validation and conversion
    let thresholds = validateThresh(req.body.thresholds);

    console.log("thresholds:");
    console.log(thresholds);

    if (thresholds === []){
        console.log("bad threshold input");
    }else{
        const client = new Pool({
            user: 'pi',
            host: 'localhost',
            database: 'test',
            password: process.env.PGPASSWORD,
            port: 5432,
        });

        let query = {
            text: 'insert into profile values(\'Hot\', 2, 10, 2, 10, 1, 2, $1, $2, $3, $4, $5, $6, $7)',
            values: thresholds,
        };

        client.query(query, (err, res) => {
            if (err) throw err;
            console.log(res);
            client.end()
        })
    }
});
router.post('/cold', function (req,res) {
    // validation and conversion
    let thresholds = validateThresh(req.body.thresholds);

    console.log("thresholds:");
    console.log(thresholds);

    if (thresholds === []){
        console.log("bad threshold input");
    }else{
        const client = new Pool({
            user: 'pi',
            host: 'localhost',
            database: 'test',
            password: process.env.PGPASSWORD,
            port: 5432,
        });

        let query = {
            text: 'insert into profile values(\'Cold\', 2, 20, 2, 2, 1, 0, $1, $2, $3, $4, $5, $6, $7)',
            values: thresholds,
        };

        client.query(query, (err, res) => {
            if (err) throw err;
            console.log(res);
            client.end()
        })
    }
});
router.post('/nw', function (req,res) {
    // validation and conversion
    let thresholds = validateThresh(req.body.thresholds);

    console.log("thresholds:");
    console.log(thresholds);

    if (thresholds === []){
        console.log("bad threshold input");
    }else{
        const client = new Pool({
            user: 'pi',
            host: 'localhost',
            database: 'test',
            password: process.env.PGPASSWORD,
            port: 5432,
        });

        let query = {
            text: 'insert into profile values(\'Normal + More Water\', 2, 16, 2, 4, 2, 1, $1, $2, $3, $4, $5, $6, $7)',
            values: thresholds,
        };

        client.query(query, (err, res) => {
            if (err) throw err;
            console.log(res);
            client.end()
        })
    }
});
router.post('/nf', function (req,res) {
    // validation and conversion
    let thresholds = validateThresh(req.body.thresholds);

    console.log("thresholds:");
    console.log(thresholds);

    if (thresholds === []){
        console.log("bad threshold input");
    }else{
        const client = new Pool({
            user: 'pi',
            host: 'localhost',
            database: 'test',
            password: process.env.PGPASSWORD,
            port: 5432,
        });

        let query = {
            text: 'insert into profile values(\'Normal + More Fan\', 2, 16, 2, 10, 1, 1, $1, $2, $3, $4, $5, $6, $7)',
            values: thresholds,
        };

        client.query(query, (err, res) => {
            if (err) throw err;
            console.log(res);
            client.end()
        })
    }
});

// CUSTOMIZED HERE!!!!
// basic 1 second
// moderate 3 seconds
// excessive 5 seconds


module.exports = router;
