var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', { title: 'Main Page' });
});

router.get('/data', async function(req,res) {
    res.send(await getPythonData());
})

let {PythonShell} = require('python-shell')
let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    //args: ['value1', 'value2', 'value3']
};
function getPythonData(){
    return new Promise(resolve => {
        PythonShell.run('main.py', options, function (err, results) {
            // Change this path!!!
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            console.log(results);
            resolve(results);
        })
    })

}


module.exports = router;
