const API_KEY = "e8bedb34"
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`

const elMovieTemplate = document.querySelector("[data-template-movie]")
const elForm = document.querySelector("[data-search-form]")
const elMovieWrapper = document.querySelector("[data-movie-wrapper]")

// Search event
elForm.addEventListener("submit", (evt) => {
  evt.preventDefault()

  const formData = new FormData(elForm)
  const name = formData.get("search")
  const type = formData.get("type")
  const year = formData.get("year")
  searchMovies(name, type, year)
})

async function searchMovies(query, type, year) {
  const res = await fetch(`${API_URL}&s=${query}&type=${type}&y=${year}`)
  const searchResult = await res.json()
  renderMovies(searchResult.Search)
}

async function getMovieId(id) {
  const res = await fetch(`${API_URL}&i=${id}`)
  const searchResultId = await res.json()
}

function renderMovies(movies) {
  elMovieWrapper.innerHTML = ""
  let html = ""
  movies.forEach(movie => {

    html += `
    <div class="card-box movie__card">
    <img class="card-img-top" src="${movie.Poster}" alt="${movie.Title} poster" data-movie-img>
    <div class="card-body">
      <p class="card-text">${movie.Title}</p>
      <button class="btn btn-primary w-100 btn-sm btn-block" type="button" data-modal-open="#modal" data-movie-id="${movie.imdbID}">INFO</button>
    </div>
  </div> 
    `

  });

  elMovieWrapper.innerHTML = html
}