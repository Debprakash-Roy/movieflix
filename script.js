const API_KEY = "41efdffdf7bc4a0ec17af61c8bbe016c";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const container = document.getElementById("movie-container");
const search = document.getElementById("search");
const modal = document.getElementById("modal");
const watchBtn = document.getElementById("watchTrailer");
const providerBtn = document.getElementById("watchProvider");
const imdbLink = document.getElementById("imdbLink");
const themeBtn = document.getElementById("themeToggle");

let favorites = JSON.parse(localStorage.getItem("fav")) || [];
let currentMovie = null;

/* ================= FETCH MOVIES ================= */
async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  showMovies(data.results);
}

getMovies(`${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`);

function showMovies(movies) {
  container.innerHTML = "";
  movies.forEach(movie => {
    const div = document.createElement("div");
    div.className = "movie";
    div.innerHTML = `
      <img src="${IMG_URL + movie.poster_path}">
      <div class="movie-info">
        <h4>${movie.title}</h4>
        <span class="${getColor(movie.vote_average)}">
          ${movie.vote_average}
        </span>
      </div>
    `;
    div.onclick = () => openModal(movie);
    container.appendChild(div);
  });
}

function getColor(v) {
  if (v >= 7) return "green";
  if (v >= 5) return "orange";
  return "red";
}

/* ================= SEARCH ================= */
search.addEventListener("keyup", e => {
  if (e.target.value.trim()) {
    getMovies(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${e.target.value}`
    );
  } else {
    getMovies(`${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`);
  }
});

/* ================= MODAL ================= */
function openModal(movie) {
  currentMovie = movie;
  modal.classList.remove("hidden");

  document.getElementById("modal-img").src = IMG_URL + movie.poster_path;
  document.getElementById("modal-title").innerText = movie.title;
  document.getElementById("modal-desc").innerText = movie.overview || "No description available";
  document.getElementById("modal-rating").innerText = movie.vote_average;

  watchBtn.onclick = () => getTrailer(movie.id);
  providerBtn.onclick = () => getWatchProviders(movie.id);
  setImdbLink(movie.id);
}

document.getElementById("close").onclick = () => {
  modal.classList.add("hidden");
};

/* ================= OFFICIAL TRAILER ================= */
async function getTrailer(movieId) {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
  );
  const data = await res.json();

  const trailer =
    data.results.find(v =>
      v.site === "YouTube" &&
      v.type === "Trailer" &&
      v.name.toLowerCase().includes("official")
    ) ||
    data.results.find(v =>
      v.site === "YouTube" &&
      v.type === "Trailer"
    );

  if (trailer) {
    window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
  } else {
    alert("Trailer not available 😢");
  }
}

/* ================= WHERE TO WATCH ================= */
async function getWatchProviders(movieId) {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`
  );
  const data = await res.json();

  const region = data.results.IN; // India
  if (region && region.link) {
    window.open(region.link, "_blank");
  } else {
    alert("No streaming platform available 😢");
  }
}

/* ================= IMDb ================= */
async function setImdbLink(movieId) {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
  );
  const data = await res.json();

  if (data.imdb_id) {
    imdbLink.href = `https://www.imdb.com/title/${data.imdb_id}`;
  } else {
    imdbLink.href = "#";
  }
}

/* ================= FAVORITES ================= */
document.getElementById("addFav").onclick = () => {
  if (!favorites.some(m => m.id === currentMovie.id)) {
    favorites.push(currentMovie);
    localStorage.setItem("fav", JSON.stringify(favorites));
    alert("Added to favorites ❤️");
  } else {
    alert("Already in favorites 👍");
  }
};

document.getElementById("favBtn").onclick = () => {
  if (favorites.length) showMovies(favorites);
  else alert("No favorites yet 😢");
};

/* ================= DARK MODE ================= */
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  themeBtn.innerText = "☀️";
}

themeBtn.onclick = () => {
  document.body.classList.toggle("light");
  const light = document.body.classList.contains("light");
  localStorage.setItem("theme", light ? "light" : "dark");
  themeBtn.innerText = light ? "☀️" : "🌙";
};
