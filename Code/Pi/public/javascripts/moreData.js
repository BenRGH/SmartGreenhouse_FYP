// Ben Rose 2018

$(document).ready(function() {

    // Get data for table
    async function getDB() {
        let dateTemps = [];
        let start = new Date('2000-11-01T00:00:00.000Z');
        let end = new Date('2050-11-01T00:00:00.000Z');

        let sdb = await axios('/sdata', {
            params: {
                start: start,
                end: end
            }
        }).catch(function (error) {
            console.log(error);
        });
        // get sensor data
        let sensorDB = sdb.data.data;
        console.log(sensorDB[1].dtime);


        for (let i in sensorDB) {
            // stick the time and temps into a fancy array
            dateTemps.push({
                time: sensorDB[i].dtime,
                temp: sensorDB[i].temp,
                humid: sensorDB[i].humid,
                l1: sensorDB[i].l1,
                l2: sensorDB[i].l2
            });
        }
        rawTable.setData(dateTemps);
    }


    console.log(getDB());

    dummyData = [{time:"Loading...", temp: 99, humid: 99, l1: 99, l2: 99}];

    // create Tabulator on DOM element
    let rawTable = new Tabulator("#rawDataTable", {
        layout:"fitDataFill",
        height:"500px",
        responsiveLayout:"hide",
        data: dummyData, //assign data to table
        index: "time",
        columns: [ //Define Table Columns
            {title: "Time", field: "time", width: 300, sorter: "datetime"},
            {title: "Temp", field: "temp"},
            {title: "Humidity", field: "humid"},
            {title: "Light 1", field: "l1"},
            {title: "Light 2", field: "l2"},
        ],
        rowClick: function (e, row) { //trigger an alert message when the row is clicked
            alert(row.getData().time);
        },
    });

    getDB(); // gets and then applies db to table after its been loaded

    $('#updateTable').click(function(){
        getDB();
    })

});
