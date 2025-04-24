document.addEventListener('DOMContentLoaded', function() {
    //DOM Elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const viewBookshelfBtn = document.getElementById('view-bookshelf');
    const searchResults = document.getElementById('search-results');
    const bookshelfResults = document.getElementById('bookshelf-results');
    const bookshelfList = document.getElementById('bookshelf-list');
    const bookModal = document.getElementById('book-modal');
    const modalBookInfo = document.getElementById('modal-book-info');
    const closeModal = document.querySelector('.close-modal');

    //Event Listeners
    searchBtn.addEventListener('click', searchBooks);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchBooks();
    });
    //toggle between search view and bookshelf view
function toggleBookshelfView() {
    searchResults.style.display = 'none';
    bookshelfResults.style.display = 'block';
    renderBookshelf();
}

//add a book to the bookshelf
function addToBookshelf(book) {
    if (!bookshelf.some(b => b.key=== book.key)) {
        bookshelf.push(book);
        localStorage.setItem('bookshelf',JSON.stringify(bookshelf));
        renderBookshelf();
        // Refresh search results to update button states
        searchBooks();
    }
}

// to remove a book from the bookshelf
function removeFromBookshelf(bookKey) {
    bookshelf = bookshelf.filter(book => book.key !== bookKey);
    localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
    renderBookshelf();
    // Refresh search results to update button states
    if (searchInput.value.trim()) {
        searchBooks();
    }
}

//render the bookshelf
function renderBookshelf() {
    bookshelfList.innerHTML = '';
    
    if (bookshelf.length === 0) {
        bookshelfList.innerHTML = '<div class="no-books">Your bookshelf is empty. Search for books to add some!</div>';
        return;
    }
    
    bookshelf.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.className = 'book-item';
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
        
        bookItem.querySelector('.btn-details').addEventListener('click', () => showBookDetails(book));
        bookItem.querySelector('.btn-remove').addEventListener('click', () => removeFromBookshelf(book.key));
        
        bookshelfList.appendChild(bookItem);
    });
}
    viewBookshelfBtn.addEventListener('click', toggleBookshelfView);
    closeModal.addEventListener('click', () => bookModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === bookModal) bookModal.style.display = 'none';
    });

    //bookshelf from local storage
    let bookshelf = JSON.parse(localStorage.getItem('bookshelf')) || [];
    renderBookshelf();

    //search books 
    function searchBooks() {
        const query = searchInput.value.trim();
        
        if (!query) {
            alert('Please enter a search term');
            return;
        }

        searchResults.innerHTML = '<div class="loading">Searching for books...</div>';
        
        // Fetch books from Open Library API
        fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (!data.docs || data.docs.length === 0) {
                    searchResults.innerHTML = '<div class="no-results">No books found. Try a different search.</div>';
                    return;
                }
                
                searchResults.innerHTML = '';
                data.docs.forEach(book => {
                    const bookCard = createBookCard(book);
                    searchResults.appendChild(bookCard);
                });
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                searchResults.innerHTML = '<div class="error">An error occurred while searching for books. Please try again later.</div>';
            });
    }

    // Function to create a book card element
    function createBookCard(bookData) {
        const book= extractBookData(bookData);
        const bookCard= document.createElement('div');
        bookCard.className= 'book-card';
        



        let html = `
            <div class="book-cover">
                ${book.image ? `<img src="${book.image}" alt="${book.title}">` : '<i class="fas fa-book fa-5x" style="color: #ccc;"></i>'}
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.authors || 'Unknown Author'}</p>
                <div class="book-actions">
                    <button class="btn-details" data-id="${book.key}">Details</button>
        `;
        
        // Check if book is already in bookshelf
        const isInBookshelf = bookshelf.some(b => b.key === book.key);
        
        if (isInBookshelf) {
            html += `<button class="btn-remove" data-id="${book.key}">Remove</button>`;
        } else {
            html += `<button class="btn-save" data-id="${book.key}">Save</button>`;
        }
        



        html += `</div></div>`;
        bookCard.innerHTML = html;
        
        // Add event listeners to the buttons
        bookCard.querySelector('.btn-details').addEventListener('click', () => showBookDetails(book));
        
        if (isInBookshelf) {
            bookCard.querySelector('.btn-remove').addEventListener('click', () => removeFromBookshelf(book.key));
        } else {
            bookCard.querySelector('.btn-save').addEventListener('click', () => addToBookshelf(book));
        }
        
        return bookCard;
    }

    //extract relevant book data from API response
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
    //show book details in modal
    function showBookDetails(book) {
        modalBookInfo.innerHTML = `
            <div class="modal-book">
                <div class="modal-book-header">
                    <div class="modal-book-cover">
                        ${book.image ? `<img src="${book.image}" alt="${book.title}">` : '<i class="fas fa-book fa-5x" style="color: #ccc;"></i>'}
                    </div>
                    <div class="modal-book-info">
                        <h2 class="modal-book-title">${book.title}</h2>
                        <p class="modal-book-author">${book.authors}</p>
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
        bookModal.style.display = 'block';
    }

});