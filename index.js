const apiKey = config.OMDBAPIKey
var request =  new XMLHttpRequest()

request.open('GET',  `http://www.omdbapi.com/?t=Rush+hour&plot=full&apikey=${apiKey}`)
request.onload = function() {
    var data = JSON.parse(this.response)
    console.log(data)
}

request.send()