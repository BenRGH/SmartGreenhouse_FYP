// Ben Rose 2018

async function run(){
    try {
        const sdb = await axios('/sdata');  // get sensor data

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

        console.log(dateTemps); // testing

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
                    text: 'Measured Sensor Temperatures (C)'
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
                                fontColor: '#ff2523'
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
                    text: 'Measured Sensor Humidity (RH)'
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
                                fontColor: '#ff2523'
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


    } catch(e){
        console.error(e);
    }
}





run();


