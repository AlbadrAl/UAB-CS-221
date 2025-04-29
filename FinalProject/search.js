// import dom elements and book card creation function
import { searchInput, searchResults } from './domElements.js';
import { createBookCard } from './render.js';

export function searchBooks() {
    // get and clean search query
    const query = searchInput.value.trim();

    // validate search input
    if (!query) {
        alert('Please enter a search term');
        return;
    }

    // show loading state
    searchResults.innerHTML = '<div class="loading">Searching for books...</div>';

    // fetch books from openlibrary api
    fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`)
        .then(response => {
            // check for network errors
            if (!response.ok) throw new Error('Network error');
            return response.json();
        })
        .then(data => {
            // handle empty results
            if (!data.docs || data.docs.length === 0) {
                searchResults.innerHTML = '<div class="no-results">No books found. Try a different search.</div>';
                return;
            }
            
            // clear previous results
            searchResults.innerHTML = '';
            
            // create and append book cards for each result
            data.docs.forEach(book => {
                const bookCard = createBookCard(book);
                searchResults.appendChild(bookCard);
            });
        })
        .catch(error => {
            // handle fetch errors
            console.error('Error:', error);
            searchResults.innerHTML = '<div class="error">An error occurred. Please try again.</div>';
        });
}