const form = document.querySelector('form');
const gallery = document.querySelector('.image-container');
const API_KEY = '3ead317';  // Your OMDb API Key

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let query = form.querySelector('input').value.trim();
    form.querySelector('input').value = '';

    if (query === '') {
        query = "nothing"; // fallback for empty input
    }

    await omdbApi(query);
});

async function omdbApi(query) {
    const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
    const data = await res.json();

    if (data.Response === "True") {
        makeImages(data.Search);
    } else {
        gallery.innerHTML = `<p>No results found for "${query}".</p>`;
    }
}

function makeImages(movies) {
    gallery.innerHTML = ''; // Clear previous images
    for (let movie of movies) {
        if (movie.Poster && movie.Poster !== "N/A") {
            const img = document.createElement('img');
            img.src = movie.Poster;
            img.alt = `${movie.Title} (${movie.Year})`;
            img.title = `${movie.Title} (${movie.Year})`;
            gallery.append(img);
        }
    }
}
