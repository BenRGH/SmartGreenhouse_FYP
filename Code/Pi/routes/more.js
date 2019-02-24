const express = require('express');
const router = express.Router();

// GET home page
router.get('/', async function(req, res, next) {
    res.render('more', { title: 'More' });
});

// Postgresness
const { Pool, Client } = require('pg');


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




module.exports = router;