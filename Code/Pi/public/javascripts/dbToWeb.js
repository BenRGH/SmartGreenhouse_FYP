// Ben Rose 2018



async function startGraphs(startDate, endDate){
    try {
        const sdb = await axios('/sdata');  // get sensor data
        const sensorDB = sdb.data.data;

        // ------------------- TEMPERATURE GRAPH -------------------------------------------

        let dateTemps = [];
        for (let i in sensorDB){
            // stick the time and temps into a fancy array the chart can use
            dateTemps.push({x: sensorDB[i].dtime, y: sensorDB[i].temp});
        }

        const wdb = await axios('/wdata');  // get weather data

        let dateTempsWeather = [];
        for (let i in wdb.data.data){
            // same as above but for weather data
            dateTempsWeather.push({x: wdb.data.data[i].dtime, y: wdb.data.data[i].temp})
        }

        // charting temps
        let tempctx = document.getElementById("tempStats").getContext('2d');
        let tempChart = new Chart(tempctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: "Sensor Temp",
                    borderColor: '#f0342d',
                    borderWidth: 2,
                    fill: false,
                    data: dateTemps
                },{
                    label: 'External Temp',
                    borderColor: '#2587f0',
                    borderWidth: 2,
                    fill: false,
                    data: dateTempsWeather
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Measured Temperature Over Time'
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        type: 'time',
                        distribution: 'series',
                        display: true,
                        position: 'bottom',
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        },
                        ticks: {
                            major: {
                                fontStyle: 'bold',
                                fontColor: '#202020'
                            }
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Temp (C)'
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });


        // ------------------- HUMIDITY GRAPH ---------------------------------------------

        let dateHumid = [];
        for (let i in sensorDB){
            // more of the same but for humidity
            dateHumid.push({x: sensorDB[i].dtime, y: sensorDB[i].humid})
        }

        let humidctx = document.getElementById("humidStats").getContext('2d');
        let humidChart = new Chart(humidctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: "Sensor Humidity",
                    borderColor: '#32f04c',
                    borderWidth: 2,
                    fill: false,
                    data: dateHumid
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Measured Humidity Over Time'
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        type: 'time',
                        distribution: 'series',
                        display: true,
                        position: 'bottom',
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        },
                        ticks: {
                            major: {
                                fontStyle: 'bold',
                                fontColor: '#202020'
                            }
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Humidity (RH)'
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });


        // ------------------- SOIL MOISTURE GRAPH -------------------------------------------

        let dateSoil = [];
        for (let i in sensorDB){
            // more of the same but for soil
            dateSoil.push({x: sensorDB[i].dtime, y: (sensorDB[i].soil/1023)*100 })
        }

        console.log(dateSoil); // testing

        let soilctx = document.getElementById("soilStats").getContext('2d');
        let soilChart = new Chart(soilctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: "Soil Moisture",
                    borderColor: '#03b3f0',
                    borderWidth: 2,
                    fill: false,
                    data: dateSoil
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Measured Soil Moisture Over Time'
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        type: 'time',
                        distribution: 'series',
                        display: true,
                        position: 'bottom',
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        },
                        ticks: {
                            major: {
                                fontStyle: 'bold',
                                fontColor: '#202020'
                            }
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Soil Moisture (Saturation%1023)'
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });


        // ------------------- LIGHT GRAPH ---------------------------------------------------

        let dateLight1 = [];
        let dateLight2 =[];
        for (let i in sensorDB){
            // more of the same but for light
            dateLight1.push({x: sensorDB[i].dtime, y: sensorDB[i].l1 });
            dateLight2.push({x: sensorDB[i].dtime, y: sensorDB[i].l2 })
        }

        let lightctx = document.getElementById("lightStats").getContext('2d');
        let lightChart = new Chart(lightctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: "Light 1 Intensity",
                    borderColor: '#f03ad1',
                    borderWidth: 2,
                    fill: false,
                    data: dateLight1
                },{
                    label: 'Light 2 Intensity',
                    borderColor: '#7437f0',
                    borderWidth: 2,
                    fill: false,
                    data: dateLight2
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Measured Light Intensity Over Time'
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        type: 'time',
                        distribution: 'series',
                        display: true,
                        position: 'bottom',
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        },
                        ticks: {
                            major: {
                                fontStyle: 'bold',
                                fontColor: '#202020'
                            }
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Measured Light Intensity (% of sensor max)'
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });


        // Once everything is loaded we can hide the loading msg and reveal date entry
        $('#loading').hide();
        $('#live').show();

    } catch(e){
        console.error(e);
        $('#loading').text("Failed to display data. Soz 🤷‍♂️");
    }
}

async function getLive() {

    const sdb = await axios('/sdata');  // get sensor data
    const sensorDB = sdb.data.data; // data is deep for some reason
    const sdbLen = sensorDB.length; // shorthand for the number of records
    const wdb = await axios('/wdata');  // get weather data
    const weatherDB = wdb.data.data;
    const wdbLen = weatherDB.length;

    // ------------------- LIVE INFO ---------------------------------------------------

    const currTemp = sensorDB[sdbLen - 1].temp; // get last record
    const currHumid = sensorDB[sdbLen - 1].humid;
    const currL1 = sensorDB[sdbLen - 1].l1;
    const currL2 = sensorDB[sdbLen - 1].l2;
    const currSoil = ((sensorDB[sdbLen - 1].soil / 1023) * 100).toFixed(2); // get percent to 2 dec places
    const currExTemp = weatherDB[wdbLen - 1].temp; // latest outside


    $('#live').html("Current Stats:<br>Temp:"+currTemp+"°C<br>Humidity:"+currHumid+"(RH)<br>L1:"+currL1+"%<br>L2:"+currL2+"%<br>Soil Moisture:"+currSoil+"%<br>External Temp:"+currExTemp+"°C");

}


$(document).ready(function() {

    let startDate, endDate; // Query range for data

    $('#dateRangeBtn').click(function(){ // When 'Go' is clicked the data is saved here
        startDate = new Date($('#startDate').val());
        endDate = new Date($('#endDate').val());
    });

    startGraphs(startDate, endDate); // passing the date range params

    try {
        getLive()
    } catch (e) {
        console.error(e);
    }

});


