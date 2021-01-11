var movieList = document.getElementById('movie-list');
var resultsection = document.querySelector('.search-result');
var nominationSection = document.querySelector('.nomination');
var nominationList = document.getElementById('nomination-list')
var resultHeading = document.getElementById('result-heading');
var formSubmit = document.getElementById('form-submit');
var moviesCollection = document.getElementsByClassName('movie'); 

const apiKey = config.OMDBAPIKey;

formSubmit.addEventListener('submit', submitSearch);
resultsection.style.visibility = 'hidden';
nominationSection.style.visibility = 'hidden'

function submitSearch(e) {
    e.preventDefault();
    let search =  e.target.firstElementChild.value;
    if(search) {
        resetInput(search);
        resultsection.style.visibility = 'visible';
        apiEndpoint(search);
    } 
}

function apiEndpoint(search) {
    resultHeading.innerHTML = `Search results for ${search}`
    var url = `http://www.omdbapi.com/?s=${search}&apikey=${apiKey}`

    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if(Array.isArray(data.Search)) {
                data.Search.forEach((movie) => {
                    // if(movie.imdbID)
                    // console.log(movie)
                    let li =  document.createElement('li')
                    li.setAttribute('class', 'movie')
                    let buttn = document.createElement('button')
                    buttn.setAttribute('class', 'nominate-button')
                    buttn.textContent = "Nominate"
                    li.textContent = `${movie.Title} (${movie.Year}) `
                    movieList.appendChild(li)
                    li.appendChild(buttn)
                    li.addEventListener('click', nominate)
                })
            }
        })
        .catch((error) => {
            console.log(error)
    }   )

}

function resetInput(search) {
    movies =  [...moviesCollection]; 
    movies.forEach((movie) => {
        if (!movie.innerHTML.includes(search)) { 
            movie.style.display="none"; 
        } 
    });
}   

function nominate(e) {
    if(e.target.classList.contains('nominate-button')) {
        nominationSection.style.visibility = 'visible';
        let li = document.createElement('li')
        let buttn = document.createElement('button')
        li.setAttribute('class', 'nominated-movie')
        buttn.className = 'remove-nomination delete'
        li.textContent = e.target.parentElement.childNodes[0].nodeValue;
        buttn.textContent = 'remove'
        nominationList.appendChild(li)
        li.appendChild(buttn)
        buttn.addEventListener('click', removeNomination)
    }
}

function removeNomination(e) {
    if(e.target.classList.contains('delete')) {
        var li = e.target.parentElement;
        nominationList.removeChild(li)
    }
}


