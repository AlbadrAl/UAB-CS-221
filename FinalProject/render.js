// render.js
// import required modules and dom elements
import { bookshelf } from './bookshelf.js';
import { bookshelfList, modalBookInfo, bookModal } from './domElements.js';
import { addToBookshelf, removeFromBookshelf } from './bookshelf.js';

// render bookshelf contents
export function renderBookshelf() {
    // clear current bookshelf display
    bookshelfList.innerHTML = '';

    // handle empty bookshelf case
    if (bookshelf.length === 0) {
        bookshelfList.innerHTML = '<div class="no-books">Your bookshelf is empty.</div>';
        return;
    }

    // create and append each book item
    bookshelf.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.className = 'book-item';
        // generate html for book item
        bookItem.innerHTML = `
            <div class="book-cover">
                ${book.image ? `<img src="${book.image}" alt="${book.title}">` : '<i class="fas fa-book" style="color: #ccc;"></i>'}
            </div>
            <div class="book-info">
                <h3>${book.title}</h3>
                <p>${book.authors}</p>
                <div class="book-actions">
                    <button class="btn-details" data-id="${book.key}">Details</button>
                    <button class="btn-remove" data-id="${book.key}">Remove</button>
                </div>
            </div>
        `;

        // add event listeners for buttons
        bookItem.querySelector('.btn-details').addEventListener('click', () => showBookDetails(book));
        bookItem.querySelector('.btn-remove').addEventListener('click', () => removeFromBookshelf(book.key));

        // add book item to bookshelf
        bookshelfList.appendChild(bookItem);
    });
}

// create book card for search results
export function createBookCard(bookData) {
    // extract and format book data
    const book = extractBookData(bookData);
    const card = document.createElement('div');
    card.className = 'book-card';

    // generate base html for card
    let html = `
        <div class="book-cover">
            ${book.image ? `<img src="${book.image}" alt="${book.title}">` : '<i class="fas fa-book fa-5x" style="color: #ccc;"></i>'}
        </div>
        <div class="book-info">
            <h3>${book.title}</h3>
            <p>${book.authors}</p>
            <div class="book-actions">
                <button class="btn-details" data-id="${book.key}">Details</button>
    `;

    // check if book is already in bookshelf
    const isInBookshelf = bookshelf.some(b => b.key === book.key);

    // add appropriate action button
    if (isInBookshelf) {
        html += `<button class="btn-remove" data-id="${book.key}">Remove</button>`;
    } else {
        html += `<button class="btn-save" data-id="${book.key}">Save</button>`;
    }

    // complete html and add to card
    html += `</div></div>`;
    card.innerHTML = html;

    // add event listeners
    card.querySelector('.btn-details').addEventListener('click', () => showBookDetails(book));

    if (isInBookshelf) {
        card.querySelector('.btn-remove').addEventListener('click', () => removeFromBookshelf(book.key));
    } else {
        card.querySelector('.btn-save').addEventListener('click', () => addToBookshelf(book));
    }

    return card;
}

// show detailed book info in modal
export function showBookDetails(book) {
    // generate modal content html
    modalBookInfo.innerHTML = `
        <div class="modal-book">
            <div class="modal-book-header">
                <div class="modal-book-cover">
                    ${book.image ? `<img src="${book.image}" alt="${book.title}">` : '<i class="fas fa-book fa-5x" style="color: #ccc;"></i>'}
                </div>
                <div class="modal-book-info">
                    <h2>${book.title}</h2>
                    <p>${book.authors}</p>
                    <p><strong>Published:</strong> ${book.publishedDate}</p>
                    <p><strong>Publisher:</strong> ${book.publisher}</p>
                    <p><strong>Pages:</strong> ${book.pageCount}</p>
                    <p><strong>Subjects:</strong> ${book.subjects}</p>
                </div>
            </div>
            <div class="modal-book-description">
                <h3>Description</h3>
                <p>${book.description}</p>
            </div>
            <div class="modal-book-links">
                <a href="https://openlibrary.org${book.key}" target="_blank" class="btn-details">View on Open Library</a>
            </div>
        </div>
    `;
    // display modal
    bookModal.style.display = 'block';
}

// extract and format book data from api response
function extractBookData(bookData) {
    const key = bookData.key || '';
    const title = bookData.title || 'No title available';
    const authors = bookData.author_name ? bookData.author_name.join(', ') : 'Unknown Author';
    const description = bookData.first_sentence ? (Array.isArray(bookData.first_sentence) ? bookData.first_sentence[0] : bookData.first_sentence) : 'No description available.';
    const image = bookData.cover_i ? `https://covers.openlibrary.org/b/id/${bookData.cover_i}-M.jpg` : null;
    const publishedDate = bookData.first_publish_year || 'Unknown';
    const publisher = bookData.publisher ? (Array.isArray(bookData.publisher) ? bookData.publisher[0] : bookData.publisher) : 'Unknown';
    const pageCount = bookData.number_of_pages_median || 'Unknown';
    const subjects = bookData.subject ? (Array.isArray(bookData.subject) ? bookData.subject.slice(0, 3).join(', ') : bookData.subject) : 'Uncategorized';

    return {
        key,
        title,
        authors,
        description,
        image,
        publishedDate,
        publisher,
        pageCount,
        subjects
    };
}