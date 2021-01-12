const apiKey = config.OMDBAPIKey;
var { formSubmit, resultsection, nominationSection, searchTerm, movieList, moviesCollection, nominationList, nominationAlert } = variableDeclaration();

function variableDeclaration() {
    movieList = document.getElementById('movie-list');
    resultsection = document.querySelector('.search-result');
    nominationSection = document.querySelector('.nomination');
    searchTerm = document.getElementById('search-term')
    nominationList = document.getElementById('nomination-list');
    formSubmit = document.getElementById('form-submit');
    moviesCollection = document.getElementsByClassName('movie-block');
    nominationAlert = document.getElementById('nomination-alert');
    return { formSubmit, resultsection, nominationSection, searchTerm, movieList, moviesCollection, nominationList, nominationAlert };
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

    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if(Array.isArray(data.Search)) {
                data.Search.forEach((movie) => {
                    let p =  document.createElement('p');
                    let div = document.createElement('div');
                    let buttn = document.createElement('button');
                    let img = document.createElement('img')
                    Object.assign(p, {
                        className: 'movie',
                        id: movie.imdbID
                    });
                
                    console.log(movie)
                
                    img.setAttribute('src', movie.Poster);
                    div.className = 'movie-block'
                    buttn.setAttribute('class', 'nominate-button');
                    buttn.textContent = "Nominate";
                    p.textContent = `${movie.Title} (${movie.Year})`;
                    movieList.appendChild(div);
                    p.appendChild(buttn);
                    div.appendChild(img)
                    div.appendChild(p);
                    p.addEventListener('click', nominate);
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
        countNomination = countNomination + 1;
        nominationSection.style.visibility = 'visible';
        let li = document.createElement('li');
        let buttn = document.createElement('button');

        Object.assign(li, {
            className: 'nominated-movie',
            id: e.target.parentElement.getAttribute('id')
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
        let movies = [...moviesCollection];

        movies.forEach((movie) => {
            if(e.target.parentElement.getAttribute('id') == movie.getAttribute('id')){
                movie.childNodes[1].disabled = false;
                movie.childNodes[1].style.backgroundColor = 'rgb(35, 95, 35)';
            }
        });

        countNomination = countNomination - 1;
        if(countNomination < 1) {
            nominationAlert.textContent = ' No item in nomination list';
        }
    }
}

function maxNomination() {
    console.log(countNomination)
    if(countNomination === MAX_NOMINATION) {
        nominationAlert.textContent = `Awww, You have reach maximum nomination of ${MAX_NOMINATION} !`;
    }
}