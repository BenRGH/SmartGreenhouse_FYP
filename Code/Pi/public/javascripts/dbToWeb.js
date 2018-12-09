// Ben Rose 2018

async function run(){
    try {
        const sdb = await axios('/sdata');  // get sensor data

        // ------------------- TEMPERATURE GRAPH -------------------------------------------

        let dateTemps = [];
        for (let i in sdb.data.data){
            // stick the time and temps into a fancy array the chart can use
            dateTemps.push({x: sdb.data.data[i].dtime, y: sdb.data.data[i].temp});
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
        for (let i in sdb.data.data){
            // more of the same but for humidity
            dateHumid.push({x: sdb.data.data[i].dtime, y: sdb.data.data[i].humid})
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
        for (let i in sdb.data.data){
            // more of the same but for soil
            dateSoil.push({x: sdb.data.data[i].dtime, y: (sdb.data.data[i].soil/1023)*100 })
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
        for (let i in sdb.data.data){
            // more of the same but for light
            dateLight1.push({x: sdb.data.data[i].dtime, y: sdb.data.data[i].l1 });
            dateLight2.push({x: sdb.data.data[i].dtime, y: sdb.data.data[i].l2 })
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


    } catch(e){
        console.error(e);
    }
}





run();


