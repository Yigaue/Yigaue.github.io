var movieList = document.getElementById('movie-list')
var resultHeading = document.getElementById('result-heading')
var formSubmit = document.getElementById('form-submit')
const apiKey = config.OMDBAPIKey

formSubmit.addEventListener('submit', submitSearch)
resultHeading.style.visibility = 'hidden'

function submitSearch(e) {
    e.preventDefault()
    let search =  e.target.firstElementChild.value
    if(search) {
        resetInput(search)
        console.log(e.target.firstElementChild.value)
        resultHeading.style.visibility = 'visible'
        apiEndpoint(search);
    } 
}

function apiEndpoint(search) {
    resultHeading.innerHTML = `Result for ${search}`
    var url = `http://www.omdbapi.com/?s=${search}&apikey=${apiKey}`

    fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            if(Array.isArray(data.Search)) {
                data.Search.forEach((movie) => {
                    console.log(movie)
                    let li =  document.createElement('li')
                    li.setAttribute('class', 'movie')
                    let buttn = document.createElement('button')
                    buttn.setAttribute('class', 'nominate-button')
                    buttn.innerText = "Nominate"
                    li.textContent = `${movie.Title} (${movie.Year}) `
                    movieList.appendChild(li)
                    li.appendChild(buttn)
                })
            }
        })
        .catch((error) => {
            console.log(error)
    }   )

}

function resetInput(search) {
    let x = document.getElementsByClassName('movie'); 
      
    for (i = 0; i < x.length; i++) {  
        if (!x[i].innerHTML.includes(search)) { 
            x[i].style.display="none"; 
        } 
    } 
}


