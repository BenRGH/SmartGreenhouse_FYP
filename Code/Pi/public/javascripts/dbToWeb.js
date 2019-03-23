// Ben Rose 2018

$(document).ready(function() {

    // Init empty charts
    // Contexts
    const tempctx = document.getElementById("tempStats").getContext('2d');
    const humidctx = document.getElementById("humidStats").getContext('2d');
    const soilctx = document.getElementById("soilStats").getContext('2d');
    const lightctx = document.getElementById("lightStats").getContext('2d');
    // Chart instances
    let tempChart = new Chart(tempctx, {
        type: 'line',
        data:{},
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
    let humidChart = new Chart(humidctx, {
        type: 'line',
        data: {},
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
    let soilChart = new Chart(soilctx, {
        type: 'scatter',
        data: {},
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
    let lightChart = new Chart(lightctx, {
        type: 'line',
        data: {},
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

    function remakeCharts(){
        // Clear old chart instances
        tempChart.destroy();
        humidChart.destroy();
        soilChart.destroy();
        lightChart.destroy();

        // Make new
        tempChart = new Chart(tempctx, {
            type: 'line',
            data:{},
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
        humidChart = new Chart(humidctx, {
            type: 'line',
            data: {},
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
        soilChart = new Chart(soilctx, {
            type: 'scatter',
            data: {},
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
        lightChart = new Chart(lightctx, {
            type: 'line',
            data: {},
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
    }

    async function chartIt(startDate, endDate){
        try {
            // Get new data from db's
            let sdb = await axios('/sdata',{
                params: {
                    start: startDate,
                    end: endDate
                }
            }).catch(function(error){
                console.log(error);
            });
            // get sensor data
            let sensorDB = sdb.data.data;

            let wdb = await axios('/wdata',{
                params:{
                    start: startDate,
                    end: endDate
                }
            }).catch((err)=>{
                console.error(err);
            });
            // get weather data
            let weatherDB = wdb.data.data;

            // ------------------- TEMPERATURE GRAPH -------------------------------------------
            let dateTemps = [];
            for (let i in sensorDB){
                // stick the time and temps into a fancy array the chart can use
                dateTemps.push({x: sensorDB[i].dtime, y: sensorDB[i].temp});

            }

            let dateTempsWeather = [];
            for (let i in weatherDB){
                // same as above but for weather data
                dateTempsWeather.push({x: weatherDB[i].dtime, y: weatherDB[i].temp})
            }

            // charting * temps
            let tempDatasets = [{
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
            }];

            // This piece of pure headache updates the chart with the above data
            tempChart.data.datasets.push(tempDatasets[0]); // Internal
            tempChart.data.datasets.push(tempDatasets[1]); // External
            tempChart.update(0);



            // ------------------- HUMIDITY GRAPH ---------------------------------------------

            let dateHumid = [];
            for (let i in sensorDB){
                // more of the same but for humidity
                dateHumid.push({x: sensorDB[i].dtime, y: sensorDB[i].humid})
            }

            let dateHumidWeather = [];
            for (let i in weatherDB){
                dateHumidWeather.push({x: weatherDB[i].dtime, y: weatherDB[i].humidity})
            }

            let humidDatasets = [{
                label: "Sensor Humidity",
                borderColor: '#32f04c',
                borderWidth: 2,
                fill: false,
                data: dateHumid
            },{
                label: 'External Humidity',
                borderColor: '#2587f0',
                borderWidth: 2,
                fill: false,
                data: dateHumidWeather
            }];

            // Update with data
            humidChart.data.datasets.push(humidDatasets[0]);
            humidChart.data.datasets.push(humidDatasets[1]);
            humidChart.update(0);

            // ------------------- SOIL MOISTURE GRAPH -------------------------------------------

            let dateSoil = [];
            for (let i in sensorDB){
                // more of the same but for soil
                dateSoil.push({x: sensorDB[i].dtime, y: 100-((sensorDB[i].soil/1023)*100) })
            }

            console.log(dateSoil); // testing

            let soilDatasets = [{
                label: "Soil Moisture",
                borderColor: '#03b3f0',
                borderWidth: 2,
                fill: false,
                data: dateSoil
            }];

            // Update with data
            soilChart.data.datasets.push(soilDatasets[0]);
            soilChart.update(0);


            // ------------------- LIGHT GRAPH ---------------------------------------------------

            let dateLight1 = [];
            let dateLight2 =[];
            for (let i in sensorDB){
                // more of the same but for light
                dateLight1.push({x: sensorDB[i].dtime, y: sensorDB[i].l1 });
                dateLight2.push({x: sensorDB[i].dtime, y: sensorDB[i].l2 })
            }

            let lightDatasets = [{
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
            }];

            // Update with data
            lightChart.data.datasets.push(lightDatasets[0]);
            lightChart.data.datasets.push(lightDatasets[1]);
            lightChart.update(0);


            // Once everything is loaded we can hide the loading msg and reveal charts
            $('#live').show();

        } catch(e){
            console.error(e);
            $('#loading').text("Failed to display data due to either database error or network disconnect. Soz 🤷‍♂️");
        }
    }

    let defaultStart = new Date(); // By default this is today
    defaultStart.setDate(defaultStart.getDate() - 3);  // 3 days before today
    let defaultEnd = new Date('2050-11-01T00:00:00.000Z'); // This'll probably be useless by 2050

    // Set the values in the input field so the above is global changing
    let startDateField = $('#startDate');

    // Sets the input fields to the default start and end values
    document.querySelector("#startDate").value = defaultStart.toISOString().substr(0,10);
    document.querySelector('#endDate').value = defaultEnd.toISOString().substr(0,10);

    chartIt(defaultStart, defaultEnd); // Draw charts with default * data
    $('#loading').hide();
    $('.statsContainer').show();

    // Adds a MOTD to the notifications with tips etc.
    let motd = function(){
        // list many different messages here and at the end add to the html

    };

    // Asks the server if there is anything to be worried about
    let defcon = function() {
        // get request for warnings from server then return

    };

    // Deals with the notifications html element
    let notifications = function(){
        // call motd and defcon, insert into html

    };
    notifications();

    // set the settings to the current in use according to db
    function loadCurrentSettings() {
        return new Promise(resolve => {
            axios.get('/settings').then(resp => {
                let settingsData = resp.data.data;
                resolve(settingsData[settingsData.length - 1])
            });
        })
    }
    loadCurrentSettings().then(test => {
        console.log('test', test); // to debug
        // insert values from test into the page

    });


    // reveals the query window and blurs background
    $('#revealContext').click(function () {
        $('#contextWindow').css("display", "block");
        $('main').addClass("blur");
    });

    // reveals the settings window and blurs background
    $('#revealSettings').click(function () {
        $('#settingsWindow').css("display", "block");
        $('main').addClass("blur");
    });

    document.addEventListener('mouseup',function (e) {
        // Unfortunately this doesn't work nicely with jquery
        let contextWindow = document.getElementById('contextWindow');
        let settingsWindow = document.getElementById('settingsWindow');

        if(!(contextWindow.contains(e.target)||settingsWindow.contains(e.target))){
            // sneaky way to hide the windows if there's a click outside of them
            $('#contextWindow').css("display", "none");
            $('#settingsWindow').css("display", "none");
            $('main').removeClass("blur");
        }
    });

    // gets data for user-specified date range and applies to graphs
    $('#dateRangeBtn').click(function(){ // When 'Go' is clicked the data is saved here
        let rawStartDate = new Date($('#startDate').val());
        console.log("raw start date: " + rawStartDate.toString());
        let rawStartTime = $('#startTime').val();
        console.log("raw start time: " + rawStartTime.toString());

        rawStartDate.setHours(parseInt(rawStartTime.substr(0,2)));
        rawStartDate.setMinutes(parseInt(rawStartTime.substr(3,2)));
        console.log(rawStartDate);

        let startDate = new Date(rawStartDate);

        let rawEndDate = new Date($('#endDate').val());
        console.log("raw end date: " + rawEndDate.toString());
        let rawEndTime = $('#endTime').val();
        console.log("raw end time: " + rawEndTime.toString());

        rawEndDate.setHours(parseInt(rawEndTime.substr(0,2)));
        rawEndDate.setMinutes(parseInt(rawEndTime.substr(3,2)));
        console.log(rawEndDate);
        let endDate = new Date(rawEndDate);

        console.log("pls work");
        // console.log(startDate);
        // console.log(endDate);

        remakeCharts(); // Have to wipe the instance before making a new one
        chartIt(startDate, endDate); // Make charts with new dataset

        $('#contextWindow').css("display", "none");
        $('#settingsWindow').css("display", "none");
        $('main').removeClass("blur");

    });

    // shows the customization menu if custom profile is selected
    $('#profileSelect').change(function() {
        let profileCustomMenu = $('#profileCustomMenu');
        switch ($('#profileSelect').val()) {
            case 'Normal':
                profileCustomMenu.hide();
                break;
            case 'Hot':
                profileCustomMenu.hide();
                break;
            case 'Cold':
                profileCustomMenu.hide();
                break;
            case 'Normal + More Water':
                profileCustomMenu.hide();
                break;
            case 'Normal + More Fan':
                profileCustomMenu.hide();
                break;
            case 'Customized':
                profileCustomMenu.show();
                // Reveal the customization menu on this profile being selected
                break;
        }
    });

    // sends given profile and threshold data to the server for validation and application
    $('#applyProfileBtn').click(function(e){
        e.preventDefault(); // Because jquery is stupid

        // Do data validation then send to db
        let profile = $('#profileSelect').val();

        if (typeof(profile) !== "string"){
            alert("No funny business.")
        }else{
            let threshTempLOWER = $('#threshTempLOWER').val();
            let threshTempUPPER = $('#threshTempUPPER').val();
            let threshLightLOWER = $('#threshLightLOWER').val();
            let threshLightUPPER = $('#threshLightUPPER').val();
            let threshSoilLOWER = $('#threshSoilLOWER').val();
            let threshSoilUPPER = $('#threshSoilUPPER').val();
            let threshHumidity = $('#threshHumidity').val();

            switch (profile){
                case "Normal":
                    axios.post('/normal',{
                        // Thresholds, server validated
                        thresholds: {
                            tempLOWER: threshTempLOWER,
                            tempUPPER: threshTempUPPER,
                            lightLOWER: threshLightLOWER,
                            lightUPPER: threshLightUPPER,
                            soilLOWER: threshSoilLOWER,
                            soilUPPER: threshSoilUPPER,
                            humidity: threshHumidity,
                        }
                    }).catch(function(error){
                            console.log(error);
                        });
                    break;

                case "Hot":
                    axios.post('/hot',{
                        // Thresholds, server validated
                        thresholds: {
                            tempLOWER: threshTempLOWER,
                            tempUPPER: threshTempUPPER,
                            lightLOWER: threshLightLOWER,
                            lightUPPER: threshLightUPPER,
                            soilLOWER: threshSoilLOWER,
                            soilUPPER: threshSoilUPPER,
                            humidity: threshHumidity,
                        }
                    }).catch(function(error){
                        console.log(error);
                    });
                    break;

                case "Cold":
                    axios.post('/cold',{
                        // Thresholds, server validated
                        thresholds: {
                            tempLOWER: threshTempLOWER,
                            tempUPPER: threshTempUPPER,
                            lightLOWER: threshLightLOWER,
                            lightUPPER: threshLightUPPER,
                            soilLOWER: threshSoilLOWER,
                            soilUPPER: threshSoilUPPER,
                            humidity: threshHumidity,
                        }
                    }).catch(function(error){
                        console.log(error);
                    });
                    break;

                case "Normal + More Water":
                    axios.post('/nw',{
                        // Thresholds, server validated
                        thresholds: {
                            tempLOWER: threshTempLOWER,
                            tempUPPER: threshTempUPPER,
                            lightLOWER: threshLightLOWER,
                            lightUPPER: threshLightUPPER,
                            soilLOWER: threshSoilLOWER,
                            soilUPPER: threshSoilUPPER,
                            humidity: threshHumidity,
                        }
                    }).catch(function(error){
                        console.log(error);
                    });
                    break;

                case "Normal + More Fan":
                    axios.post('/nf',{
                        // Thresholds, server validated
                        thresholds: {
                            tempLOWER: threshTempLOWER,
                            tempUPPER: threshTempUPPER,
                            lightLOWER: threshLightLOWER,
                            lightUPPER: threshLightUPPER,
                            soilLOWER: threshSoilLOWER,
                            soilUPPER: threshSoilUPPER,
                            humidity: threshHumidity,
                        }
                    }).catch(function(error){
                        console.log(error);
                    });
                    break;

                case "Customized":
                    axios.post('/customized', {
                        // Server manages validation, if it ain't allowed it won't work
                        customProfile: {
                            light: $('#lightCtrl').val(),
                            lightDelay: $('#lightTiming').val(),
                            fan: $('#fanCtrl').val(),
                            fanDelay: $('#fanTiming').val(),
                            pumpAmount: $('#pumpAmount').val(),
                            pumpDelay: $('#pumpTiming').val(),
                        },

                        thresholds: {
                            tempLOWER: threshTempLOWER,
                            tempUPPER: threshTempUPPER,
                            lightLOWER: threshLightLOWER,
                            lightUPPER: threshLightUPPER,
                            soilLOWER: threshSoilLOWER,
                            soilUPPER: threshSoilUPPER,
                            humidity: threshHumidity,
                        }


                    }).catch(function(e){
                        console.log(e);
                    });
                    break;


            }
        }
    });

    // Allows tooltips to be shown on hover
    $('[data-toggle="tooltip"]').tooltip({ boundary: 'window' });

    // show the graphs in list mode on click
    $('#listDisplayBtn').click(function () {
        let listDisplayBtn = $('#listDisplayBtn');
        if(listDisplayBtn.has(".divAsBtn")){
            $('#gridDisplayBtn').addClass("divAsBtn"); // so it doesn't appear as a btn
            listDisplayBtn.removeClass("divAsBtn");
            $('.statsContainer').css("display","block"); // it's normally flex
            $('.colResize').removeClass("col-md-6"); // add this back after
        }
    });

    // show the graphs in grid mode on click
    $('#gridDisplayBtn').click(function () {
        let gridDisplayBtn = $('#gridDisplayBtn');
        if(gridDisplayBtn.has(".divAsBtn")){
            $('#listDisplayBtn').addClass("divAsBtn"); // so it doesn't appear as a btn
            gridDisplayBtn.removeClass("divAsBtn");
            $('.statsContainer').css("display","flex");
            $('.colResize').addClass("col-md-6");
        }
    });

    // hides settings/query windows
    $('.closeWindowBtn').click(function () {
        $('#contextWindow').css("display", "none");
        $('#settingsWindow').css("display", "none");
        $('main').removeClass("blur");
    });
});


