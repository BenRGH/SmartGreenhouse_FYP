var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Main Page', pyOut: getPythonData() });
});

let {PythonShell} = require('python-shell')
let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    //args: ['value1', 'value2', 'value3']
};
function getPythonData(){
    return PythonShell.run('./main.py', options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log(results)
        return results;
    });
}


module.exports = router;
