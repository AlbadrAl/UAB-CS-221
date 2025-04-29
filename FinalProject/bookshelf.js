// bookshelf.js

// Import required DOM elements and functions from other modules
import { bookshelfList, searchInput } from './domElements.js';
import { renderBookshelf, showBookDetails } from './render.js';
import { searchBooks } from './search.js';

// Initialize bookshelf array from localStorage or create empty array if none exists
export let bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || [];

/**
 * Adds a book to the bookshelf if it's not already present
 */
export function addToBookshelf(book) {
    // Check if book already exists in bookshelf
    if (!bookshelf.some(b => b.key === book.key)) {
        // Add new book to array
        bookshelf.push(book);
        // Update localStorage with new bookshelf data
        localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
        // Refresh the bookshelf display
        renderBookshelf();
        // Refresh search results to update UI (e.g., change "Save" to "Remove")
        searchBooks();
    }
}

/**
 * Removes a book from the bookshelf by its unique key
 */
export function removeFromBookshelf(bookKey) {
    //filter out the book to remove
    bookshelf = bookshelf.filter(book => book.key !== bookKey);
    //update localStorage with modified bookshelf
    localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
    //refresh the bookshelf display
    renderBookshelf();
    // If there's an active search, refresh results to update UI
    if (searchInput.value.trim()) searchBooks();
}