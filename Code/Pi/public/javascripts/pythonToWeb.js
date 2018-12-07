
let timeout = setTimeout(function () {
    getData()
},4000)


function getData () {
    axios.get('/data')
        .then(function (response) {
            // handle success
            // DO THINGS WITH DATA HERE!
            document.querySelector('#stats').innerHTML=response.data; //could lead to injections lol






            timeout = setTimeout(function () {
                getData()
            },4000)
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}


