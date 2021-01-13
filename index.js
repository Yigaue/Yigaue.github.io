const apiKey = config.OMDBAPIKey;
var { formSubmit, resultsection, nominationSection, searchTerm, movieList, moviesCollection, nominationList, nominationAlert, shearableLink } = variableDeclaration();

function variableDeclaration() {
    movieList = document.getElementById('movie-list');
    resultsection = document.querySelector('.search-result');
    nominationSection = document.querySelector('.nomination');
    searchTerm = document.getElementById('search-term')
    nominationList = document.getElementById('nomination-list');
    formSubmit = document.getElementById('form-submit');
    moviesCollection = document.getElementsByClassName('movie-block');
    nominationAlert = document.getElementById('nomination-alert');
    shearableLink = document.getElementById('shareable-link');
    return { formSubmit, resultsection, nominationSection, searchTerm, movieList, moviesCollection, nominationList, nominationAlert, shearableLink };
}

formSubmit.addEventListener('submit', submitSearch);
resultsection.style.visibility = 'hidden';
nominationSection.style.visibility = 'hidden';

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
    searchTerm.textContent = search;
    var url = `http://www.omdbapi.com/?s=${search}&apikey=${apiKey}`;
    let loader = `<div class="loader"></div>`;
    movieList.innerHTML = loader;
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let showmovie = ``;
            if(Array.isArray(data.Search)) {
                data.Search.forEach((movie) => {
                showmovie +=
                   `<div class = "movie-block">
                       <img src = "${movie.Poster}">
                          <p class ="movie" id="${movie.imdbID}">
                          ${movie.Title} ${movie.Year}
                            <button class="nominate-button">Nominate</button>  
                          </p> 
                       </img>
                   </div>`
                   movieList.innerHTML = showmovie;
                   let buttns = [...document.getElementsByClassName('nominate-button')];
                   buttns.forEach((buttn) => {
                    buttn.addEventListener('click', nominate)
                   });
                })
            }
        })
        .catch((error) => {
            console.log(error);
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
        nominationAlert.textContent = '';
        nominationAlert.className = ''
        countNomination = countNomination + 1;
        nominationSection.style.visibility = 'visible';
        let li = document.createElement('li');
        let buttn = document.createElement('button');
        Object.assign(li, {
            className: 'nominated-movie',
            id: e.target.parentElement.getAttribute('id'),
            style :`background-image:url(${e.target.parentElement.previousElementSibling.getAttribute("src")})`
        });

        buttn.className = 'remove-nomination delete';
        li.textContent = e.target.parentElement.childNodes[0].nodeValue;
        buttn.textContent = 'remove'
        nominationList.appendChild(li);
        li.appendChild(buttn);
        buttn.addEventListener('click', removeNomination);
        e.target.disabled = true;
        e.target.style.backgroundColor = 'rgb(212, 211, 211)';
        maxNomination();   
    }
}

function removeNomination(e) {
    if(e.target.classList.contains('delete')) {
        var li = e.target.parentElement;
        nominationList.removeChild(li)
        nominationAlert.textContent = '';
        nominationAlert.className = ''
        let movies = [...moviesCollection];

        movies.forEach((movie) => {
            if(e.target.parentElement.getAttribute('id') == movie.children[1].getAttribute('id')){
                movie.children[1].firstElementChild.disabled = false;
                movie.children[1].firstElementChild.style.backgroundColor = 'rgb(35, 95, 35)';
            }
        });

        countNomination = countNomination - 1;
        if(countNomination < 1) {
            nominationAlert.textContent = ' No item in nomination list';
        }
    }
}

function maxNomination() {
    if(countNomination === MAX_NOMINATION) {
        nominationAlert.textContent = `Awww, You have reach the maximum nomination of ${MAX_NOMINATION} !`;
        nominationAlert.className = 'nomination-alert'
    }
}

var urlAddress = window.location.href;
   
let copyShareableLink = () => {
    console.log(shearableLink)
    shearableLink.innerHTML = `<button class="copy"> &raquo; </button> <input class="copy-input" value="${urlAddress}">`
    document.querySelector('.copy-input').select();
    document.execCommand('copy')
}

shearableLink.addEventListener('click', copyShareableLink)