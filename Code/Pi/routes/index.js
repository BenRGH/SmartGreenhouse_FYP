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

// Profile setting
router.post('/normal', function (req,res) {
    const client = new Pool({
        user: 'pi',
        host: 'localhost',
        database: 'test',
        password: process.env.PGPASSWORD,
        port: 5432,
    });

    let query = {
        text: 'insert into profile values(\'Normal\', 2, 16, 2, 4, 1, 1)',
    };

    client.query(query, (err, res) => {
        if (err) throw err;
        console.log(res);
        client.end()
    })
});
router.post('/hot', function (req,res) {
    const client = new Pool({
        user: 'pi',
        host: 'localhost',
        database: 'test',
        password: process.env.PGPASSWORD,
        port: 5432,
    });

    let query = {
        text: 'insert into profile values(\'Hot\', 2, 10, 2, 10, 1, 2)',
    };

    client.query(query, (err, res) => {
        if (err) throw err;
        console.log(res);
        client.end()
    })
});
router.post('/cold', function (req,res) {
    const client = new Pool({
        user: 'pi',
        host: 'localhost',
        database: 'test',
        password: process.env.PGPASSWORD,
        port: 5432,
    });

    let query = {
        text: 'insert into profile values(\'Cold\', 2, 20, 2, 2, 1, 0)',
    };

    client.query(query, (err, res) => {
        if (err) throw err;
        console.log(res);
        client.end()
    })
});
router.post('/nw', function (req,res) {
    const client = new Pool({
        user: 'pi',
        host: 'localhost',
        database: 'test',
        password: process.env.PGPASSWORD,
        port: 5432,
    });

    let query = {
        text: 'insert into profile values(\'Normal + More Water\', 2, 16, 2, 4, 2, 1)',
    };

    client.query(query, (err, res) => {
        if (err) throw err;
        console.log(res);
        client.end()
    })
});
router.post('/nf', function (req,res) {
    const client = new Pool({
        user: 'pi',
        host: 'localhost',
        database: 'test',
        password: process.env.PGPASSWORD,
        port: 5432,
    });

    let query = {
        text: 'insert into profile values(\'Normal + More Fan\', 2, 16, 2, 10, 1, 1)',
    };

    client.query(query, (err, res) => {
        if (err) throw err;
        console.log(res);
        client.end()
    })
});



// GET live values
router.get('/live', async function(req,res){
    // Return live vals

});

module.exports = router;
