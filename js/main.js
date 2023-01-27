const API_KEY = "e8bedb34";
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

const elMovieTemplate = document.querySelector("[data-template-movie]");
const elForm = document.querySelector("[data-search-form]");
const elMovieWrapper = document.querySelector("[data-movie-wrapper]");
const elMoviePagination = document.querySelector("[data-movie-pagination]");
const elModalInner = document.querySelector("[data-modal-inner]");

// Search event
elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const formData = new FormData(elForm);
  const name = formData.get("search");
  const type = formData.get("type");
  const year = formData.get("year");
  searchMovies(name, year, type);
});

// Search function
async function searchMovies(query, year, type, page = 1) {
  elMovieWrapper.innerHTML = `<img src="../media/Spinner-1s-200px.gif" />`;
  const res = await fetch(
    `${API_URL}&s=${query}&page=${page}&y=${year}&type=${type}`
  );
  const searchResult = await res.json();
  renderMovies(searchResult.Search);
  renderPagination(Math.ceil(searchResult.totalResults / 10), query, page);
}

// GetMovie ID
async function getMovieId(id) {
  const res = await fetch(`${API_URL}&i=${id}`);
  const searchResultId = await res.json();

  return searchResultId;
}

// Render Movies fn
function renderMovies(movies) {
  elMovieWrapper.innerHTML = "";
  let html = "";
  movies.forEach((movie) => {
    const moviePosterUrl =
      movie.Poster === "N/A"
        ? "https://via.placeholder.com/180x270"
        : movie.Poster;
    html += `
    <div class="card-box movie__card">
    <img class="card-img-top" src="${moviePosterUrl}" alt="${movie.Title} poster" data-movie-img>
    <div class="card-body">
      <p class="card-text">${movie.Title}</p>
      <button class="card-box__btn btn btn-primary w-100 btn-sm btn-block" type="button" data-modal-open="#modal" data-movie-id="${movie.imdbID}">INFO</button>
    </div>
  </div> 
    `;
  });

  elMovieWrapper.innerHTML = html;
}

// Render pagination fn
function renderPagination(totalPages, query, page) {
  elMoviePagination.innerHTML = "";
  html = "";

  html += ` <li class="page-item${+page === 1 ? " disabled" : ""
    }"><a class="page-link" href="?page=${+page - 1}" data-movie-page="${+page - 1
    }" data-movie-query="${query}">Previous</a></li>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `
  <li class="page-item${+page === i ? " active" : ""
      }"><a class="page-link" href="?page=${i}" data-movie-page="${i}" data-movie-query="${query}">${i}</a></li>
  `;
  }
  html += ` <li class="page-item${+page === totalPages ? " disabled" : ""
    }"><a class="page-link" href="?page=${+page + 1}" data-movie-page="${+page + 1
    }" data-movie-query="${query}">Next</a></li>`;

  elMoviePagination.innerHTML = html;
}

// Modal events
document.addEventListener("click", (evt) => {
  onModalBtnClick(evt);
  onModalOutsideClick(evt);
  onModalCloseClick(evt);
  onPageClick(evt);

  document.addEventListener("keydown", (btn) => {
    if (btn.key == "Escape") {
      document.querySelector("[data-modal]").classList.remove("show");
    }
  });
});

// Modal open
function onModalBtnClick(evt) {
  let elTarget = evt.target.closest("[data-modal-open]");

  if (!elTarget) return;
  const modalSelector = elTarget.dataset.modalOpen;
  const movieId = elTarget.dataset.movieId;
  const elModal = document.querySelector(modalSelector);
  const elModalSpinner = elModal.querySelector("[data-modal-spinner]");

  fillModal(movieId, elModalSpinner);

  elModal.classList.add("show");
}

// Modal outside close
function onModalOutsideClick(evt) {
  let elTarget = evt.target;

  if (!elTarget.matches("[data-modal]")) return;
  elTarget.classList.remove("show");
}

// Modal close
function onModalCloseClick(evt) {
  let elTarget = evt.target.closest("[data-modal-close]");

  if (!elTarget) return;

  elTarget.parentElement.parentElement.parentElement.classList.remove("show");
}

// Page click fn
function onPageClick(evt) {
  let elTarget = evt.target.closest("[data-movie-page]");

  if (!elTarget) return;

  evt.preventDefault();
  const formData = new FormData(elForm);
  const type = formData.get("type");
  const year = formData.get("year");

  searchMovies(
    elTarget.dataset.movieQuery,
    year,
    type,
    elTarget.dataset.moviePage
  );
}

async function fillModal(movieId, elModalSpinner) {
  try {
    elModalSpinner.classList.remove("d-none");

    const movie = await getMovieId(movieId);

    elModalInner.querySelector("[data-modal-title]").textContent = `Title: ${movie.Title}`;
    elModalInner.querySelector("[data-modal-year-text]").textContent = `Year: ${movie.Year}`;
    elModalInner.querySelector("[data-modal-rating-text]").textContent = `Rating: ${movie.Rated}`;
    elModalInner.querySelector("[data-modal-duration-text]").textContent = `Duration ${movie.Runtime}`;
    elModalInner.querySelector("[data-modal-genre-text]").textContent = `Genres: ${movie.Genre}`;
    elModalInner.querySelector("[data-modal-lang-text]").textContent = `Lang: ${movie.Language}`;
    elModalInner.querySelector("[data-modal-type-text]").textContent = `Type: ${movie.Type}⭐`;
    elModalInner.querySelector("[data-modal-imdb-text]").textContent = `imdB: ${movie.imdbRating}`;
  } catch (error) {
    alert(err)
  } finally {
    elModalSpinner.classList.add("d-none");
  }
}
