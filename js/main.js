const API_KEY = "e8bedb34"
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`

const elMovieTemplate = document.querySelector("[data-template-movie]")
const elForm = document.querySelector("[data-search-form]")
const elMovieWrapper = document.querySelector("[data-movie-wrapper]")

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault()

  const formData = new FormData(elForm)
  const name = formData.get("Search")
  searchMovies(name)
})

async function searchMovies(query) {
  const res = await fetch(`${API_URL}&s=${query}`)
  const searchResult = await res.json()
  renderMovies(searchResult.Search)
}

function renderMovies(movies) {
  elMovieWrapper.innerHTML = ""
  movies.forEach(movie => {
    const elCard = elMovieTemplate.content.cloneNode(true)
    const elCardImg = elCard.querySelector("[data-movie-img]")
    const elCardText = elCard.querySelector("[data-movie-text]")


    elCardImg.src = movie.Poster
    elCardImg.alt = movie.Title
    elCardText.textContent = movie.Title

    elMovieWrapper.appendChild(elCard)
  });
}