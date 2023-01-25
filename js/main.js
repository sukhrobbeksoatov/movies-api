const API_KEY = "e8bedb34"
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`

const elMovieTemplate = document.querySelector("[data-template-movie]")
const elForm = document.querySelector("[data-search-form]")
const elMovieWrapper = document.querySelector("[data-movie-wrapper]")
const elModal = document.querySelector("[data-modal]")

// Search event
elForm.addEventListener("submit", (evt) => {
  evt.preventDefault()

  const formData = new FormData(elForm)
  const name = formData.get("search")
  const type = formData.get("type")
  const year = formData.get("year")
  searchMovies(name, type, year)
})

// Search function
async function searchMovies(query, type, year) {
  const res = await fetch(`${API_URL}&s=${query}&type=${type}&y=${year}`)
  const searchResult = await res.json()
  renderMovies(searchResult.Search)
}

// GetMovie ID
async function getMovieId(id) {
  const res = await fetch(`${API_URL}&i=${id}`)
  const searchResultId = await res.json()

  return searchResultId
}

// Render Movies fn
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

// Modal events
document.addEventListener("click", evt => {
  onModalBtnClick(evt)
  onModalOutsideClick(evt)
  onModalCloseClick(evt)

  document.addEventListener("keydown", btn => {
    if (btn.key == "Escape") {
      elModal.classList.remove("show")
    }
  })
})

function onModalBtnClick(evt) {
  let elTarget = evt.target.closest("[data-modal-open]")

  if (!elTarget) return
  const modalSelector = elTarget.dataset.modalOpen
  const movieId = elTarget.dataset.movieId

  fillModal(movieId)

  document.querySelector(modalSelector).classList.add("show")
}

function onModalOutsideClick(evt) {
  let elTarget = evt.target

  if (!elTarget.matches("[data-modal]")) return
  elTarget.classList.remove("show")
}

function onModalCloseClick(evt) {
  let elTarget = evt.target.closest("[data-modal-close]")

  if (!elTarget) return

  elTarget.parentElement.parentElement.classList.remove("show")
}

async function fillModal(movieId) {
  const movie = await getMovieId(movieId)

  elModal.querySelector("[data-modal-title]").textContent = `Title: ${movie.Title}`
  elModal.querySelector("[data-modal-year-text]").textContent = `Year: ${movie.Year}`
  elModal.querySelector("[data-modal-rating-text]").textContent = `Rating: ${movie.Rated}`
  elModal.querySelector("[data-modal-duration-text]").textContent = `Duration ${movie.Runtime}`
  elModal.querySelector("[data-modal-genre-text]").textContent = `Genres: ${movie.Genre}`
  elModal.querySelector("[data-modal-lang-text]").textContent = `Lang: ${movie.Language}`
  elModal.querySelector("[data-modal-type-text]").textContent = `Type: ${movie.Type}⭐`
  elModal.querySelector("[data-modal-imdb-text]").textContent = `imdB: ${movie.imdbRating}`
}