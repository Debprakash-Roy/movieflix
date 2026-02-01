const API_KEY = "41efdffdf7bc4a0ec17af61c8bbe016c";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const container = document.getElementById("movie-container");
const search = document.getElementById("search");
const modal = document.getElementById("modal");

let favorites = JSON.parse(localStorage.getItem("fav")) || [];
let currentMovie = null;

// FETCH MOVIES
async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  showMovies(data.results);
}

// INITIAL LOAD
getMovies(`${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`);

// SHOW MOVIES
function showMovies(movies) {
  container.innerHTML = "";
  movies.forEach(movie => {
    const div = document.createElement("div");
    div.classList.add("movie");

    div.innerHTML = `
      <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
      <div class="movie-info">
        <h4>${movie.title}</h4>
        <span class="${getColor(movie.vote_average)}">
          ${movie.vote_average}
        </span>
      </div>
    `;

    div.addEventListener("click", () => openModal(movie));
    container.appendChild(div);
  });
}

// RATING COLOR
function getColor(rate) {
  if (rate >= 7) return "green";
  if (rate >= 5) return "orange";
  return "red";
}

// SEARCH
search.addEventListener("keyup", e => {
  if (e.target.value) {
    getMovies(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${e.target.value}`
    );
  }
});

// MODAL
function openModal(movie) {
  currentMovie = movie;
  modal.classList.remove("hidden");
  document.getElementById("modal-img").src = IMG_URL + movie.poster_path;
  document.getElementById("modal-title").innerText = movie.title;
  document.getElementById("modal-desc").innerText = movie.overview;
  document.getElementById("modal-rating").innerText = movie.vote_average;
}

document.getElementById("close").onclick = () => {
  modal.classList.add("hidden");
};

// FAVORITES
document.getElementById("addFav").onclick = () => {
  favorites.push(currentMovie);
  localStorage.setItem("fav", JSON.stringify(favorites));
  alert("Added to favorites ❤️");
};

document.getElementById("favBtn").onclick = () => {
  showMovies(favorites);
};

// DARK MODE
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light");
};

