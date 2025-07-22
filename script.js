const form = document.querySelector('form');
const gallery = document.querySelector('.image-container');
const API_KEY = '3ead317';
const genreFilter = document.getElementById('genre-filter');
const yearFilter = document.getElementById('year-filter');

let currentQuery = '';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  currentQuery = form.querySelector('input').value.trim();
  if (!currentQuery) currentQuery = 'movie';
  await omdbApi(currentQuery);
});

genreFilter.addEventListener('change', () => {
  if(currentQuery) omdbApi(currentQuery);
});

yearFilter.addEventListener('change', () => {
  if(currentQuery) omdbApi(currentQuery);
});

async function omdbApi(query) {
  gallery.innerHTML = 'Loading...';
  const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
  const data = await res.json();

  if (data.Response === "True") {
    const filteredMovies = [];

    for (let movie of data.Search) {
      const detailsRes = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`);
      const details = await detailsRes.json();

      const selectedGenre = genreFilter.value;
      const selectedYear = yearFilter.value;

      if ((selectedGenre === '' || details.Genre.includes(selectedGenre)) &&
          (selectedYear === '' || details.Year === selectedYear)) {
        filteredMovies.push(details);
      }
    }

    if(filteredMovies.length > 0) {
      makeMovieCards(filteredMovies);
    } else {
      gallery.innerHTML = `<p>No movies found for selected filters.</p>`;
    }
  } else {
    gallery.innerHTML = `<p>No results found for "${query}".</p>`;
  }
}

function makeMovieCards(movies) {
  gallery.innerHTML = '';
  for (let movie of movies) {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.innerHTML = `
      <h3>${movie.Title} (${movie.Year})</h3>
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Director:</strong> ${movie.Director}</p>
      <p><strong>Actors:</strong> ${movie.Actors}</p>
      <p><strong>Plot:</strong> ${movie.Plot}</p>
      <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
      <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}" alt="${movie.Title}" />
    `;
    gallery.appendChild(card);
  }
}


// Populate year filter dropdown dynamically on page load
const currentYear = new Date().getFullYear();
for(let y = currentYear; y >= 2000; y--) {
  const option = document.createElement('option');
  option.value = y.toString();
  option.textContent = y.toString();
  yearFilter.appendChild(option);
}
