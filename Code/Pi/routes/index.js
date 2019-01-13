const express = require('express');
const router = express.Router();

// Postgresness
const { Pool, Client } = require('pg')

// GET home page
router.get('/', async function(req, res, next) {
  res.render('index', { title: 'Main Page' });
});

// GET sensor data
router.get('/sdata', async function(req,res) {
    const client = new Pool({
        user: 'pi',
        host: 'localhost',
        database: 'test',
        password: process.env.PGPASSWORD,
        port: 5432,
    });

    console.log(req.query.start, req.query.end);

    const getDataQuery = {
        name: 'getData',
        text: 'SELECT * FROM sensors WHERE dtime BETWEEN $1::TIMESTAMP AND $2::TIMESTAMP',
        values: [req.query.start, req.query.end]
    };

    client.query(getDataQuery).then(resp => {
        if (resp.rows.length < 1){
            client.end();
            console.log("help");
            return res.json({ success: false, msg: 'Database read error' });
        }

        client.end();
        return res.json({ success: true, data: resp.rows });
    }).catch(function (error) {
        console.log(error);
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

    client.query('SELECT * FROM weather').then(resp => {
        if (resp.rows.length < 1){
            client.end();
            return res.json({ success: false, msg: 'Database read error' });
        }

        client.end();
        return res.json({ success: true, data: resp.rows })
    })
});

module.exports = router;
