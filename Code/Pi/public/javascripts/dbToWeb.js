let timeout = setTimeout(function () {
    getData()
},4000)


function getData () {
    axios.get('/data')
        .then(function (response) {
            // handle success
            // document.querySelector('#stats').innerHTML=JSON.stringify(response.data);

            let jsonData = response.data;

            timeout = setTimeout(function () {
                getData()
            },4000);

            return jsonData;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}




