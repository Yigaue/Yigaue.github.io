const apiKey = config.OMDBAPIKey;
var { formSubmit, resultsection, nominationSection, resultHeading, movieList, moviesCollection, nominationList, nominationAlert } = variableDeclaration();

function variableDeclaration() {
    movieList = document.getElementById('movie-list');
    resultsection = document.querySelector('.search-result');
    nominationSection = document.querySelector('.nomination');
    nominationList = document.getElementById('nomination-list');
    resultHeading = document.getElementById('result-heading');
    formSubmit = document.getElementById('form-submit');
    moviesCollection = document.getElementsByClassName('movie');
    nominationAlert = document.getElementById('nomination-alert');
    return { formSubmit, resultsection, nominationSection, resultHeading, movieList, moviesCollection, nominationList, nominationAlert };
}

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
                    let li =  document.createElement('li')
                    Object.assign(li, {
                        className: 'movie',
                        id: movie.imdbID
                    });

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
    let movies = [...moviesCollection];
    movies.forEach((movie) => {
        if (!movie.innerHTML.includes(search)) { 
            movie.style.display="none"; 
        } 
    });
}   

const MAX_NOMINATION = 5;
var countNomination = 0;

function nominate(e) {
    if(e.target.classList.contains('nominate-button') && countNomination < MAX_NOMINATION) {
        countNomination = countNomination + 1;
        nominationSection.style.visibility = 'visible';
        let li = document.createElement('li');
        let buttn = document.createElement('button');

        Object.assign(li, {
            className: 'nominated-movie',
            id: e.target.parentElement.getAttribute('id')
        });

        buttn.className = 'remove-nomination delete'
        li.textContent = e.target.parentElement.childNodes[0].nodeValue;
        buttn.textContent = 'remove'
        nominationList.appendChild(li)
        li.appendChild(buttn)
        buttn.addEventListener('click', removeNomination)
        e.target.disabled = true;
        maxNomination();
    }
}

function removeNomination(e) {
    if(e.target.classList.contains('delete')) {
        var li = e.target.parentElement;
        nominationList.removeChild(li)
        nominationAlert.textContent = ' '
        let movies = [...moviesCollection];
        movies.forEach((movie) => {
            if(e.target.parentElement.getAttribute('id') == movie.getAttribute('id')){
                // movie.
                movie.childNodes[1].disabled = false;
            }
        })
        countNomination = countNomination - 1;
    }
}

function maxNomination() {
    console.log(countNomination)
    if(countNomination === MAX_NOMINATION) {
        nominationAlert.textContent = `Awww, You have reach maximum nomination of ${MAX_NOMINATION} !`;
    }
}