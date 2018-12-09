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

    client.query('SELECT * FROM sensors').then(resp => {
        if (resp.rows.length < 1){
            client.end();
            return res.json({ success: false, msg: 'Database read error' });
        }

        client.end();
        return res.json({ success: true, data: resp.rows });
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
