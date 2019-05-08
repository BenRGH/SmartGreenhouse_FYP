const express = require('express');
const router = express.Router();

// GET page
router.get('/', async function(req, res, next) {
    res.render('howitworks', { title: 'How It Works' });
});

router.get('/index', async function(req, res, next) {
    res.render('index', { title: 'Home' });
});


module.exports = router;