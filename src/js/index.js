import movieTpl from './movie.hbs'

const BASE_URL = 'http://localhost:3000/movies'


const getMovieBtn = document.querySelector('.getMoviesBtn')
const form = document.querySelector('form')
const tableBody = document.querySelector('tbody.tableBody')
getMovieBtn.addEventListener('click', getMovies)
form.addEventListener('submit', addMovie)

//Функція для отримання данних фільмів
function getMovies(e) {
    const options = {
        method: 'GET',
    }
    fetch(`${BASE_URL}`,options)
    .then(response => response.json())
    .then(res => {
        tableBody.innerHTML = movieTpl(res)
    })
}


//Функція для створення фільму
function addMovie(e) {
    e.preventDefault()
    const titleValue = e.currentTarget.elements.title.value
    const directorValue = e.currentTarget.elements.director.value
    const genreValue = e.currentTarget.elements.genre.value
    const yearValue = e.currentTarget.elements.year.value

    const newMovie = {
        title: titleValue,
        genre: directorValue,
        director: genreValue,
        year: yearValue
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMovie)
    }

    fetch(`${BASE_URL}`,options)
    .then(response => response.json())
}

//Функція для видалення фільму
function deleteMovie(movieId) {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(`${BASE_URL}/${movieId}`,options)
    .then(response => response.json())
}

//Функція для редагування данних фільму
function updateMovie(movieId,action) {
    const [titleInputValue,directorInputValue,genreInputValue,yearInputValue] = getInputsValue(action).editedMovies
    const update = {
        title: titleInputValue,
        director: directorInputValue,
        genre: genreInputValue,
        year: yearInputValue
    }
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(update)
    }

    fetch(`${BASE_URL}/${movieId}`,options)
    .then(response => response.json())
}


//Функція для оновлення данних  фільму
function editMovie(movieId, action) {
    const [titleInputValue,directorInputValue,genreInputValue,yearInputValue] = getInputsValue(action).editedMovies
    const editedMovies = {
        title: titleInputValue,
        director: directorInputValue,
        genre: genreInputValue,
        year: yearInputValue
    }
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedMovies)
    }

    fetch(`${BASE_URL}/${movieId}`,options)
    .then(response => response.json())
}


//Створення модального вікна
const modal = document.querySelector('.modal');
const saveChanges = document.querySelector('.saveChanges');
saveChanges.addEventListener('click', returnMoviesData)

tableBody.addEventListener('click', (event) => {
    if(event.target.nodeName === 'BUTTON') {
        showModal(event)
    }
});


function showModal(event) {
  modal.style.display = 'block';
  saveChanges.id = event.target.id
  saveChanges.dataset.action = event.target.dataset.action 
}

function returnMoviesData(event) {
    const action = event.target.dataset.action;
    const id = event.target.id;
    if (action === 'update') {
        updateMovie(id, action);
    } else if (action === 'edit') {
        editMovie(id, action)
    } else if (action === 'delete') {
        deleteMovie(id);
    }
    modal.style.display = 'none';
}

//Отримуємо значення інпутів та відсортовуємо їх якщо користувач хоче оновити тільки деякі данні
function getInputsValue(action) {
    const titleInputValue = document.getElementById('editTitle').value
    const directorInputValue = document.getElementById('editDirector').value
    const genreInputValue = document.getElementById('editGenre').value
    const yearInputValue = document.getElementById('editYear').value
    const editedMovies = []
    const inputsValue = [titleInputValue, directorInputValue, yearInputValue, genreInputValue]
    for (let inputValue of inputsValue) {
        if (inputValue !== '') {
            editedMovies.push(inputValue)
        } else if (action === 'update') {
            editedMovies.push(inputValue)
        }
        console.log(editedMovies);
    }
     
    return {editedMovies}
}