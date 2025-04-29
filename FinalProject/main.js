function loadComponent(id, file) {
    const isInsidePages = window.location.pathname.includes('/pages/');
    const path = isInsidePages ? `../components/${file}` : `./components/${file}`;

    return fetch(path)
        .then(response => response.text())
        .then(html => {
            document.getElementById(id).innerHTML = html;
        })
        .catch(err => console.error('Error loading component:', err));
}

async function init() {
    //load header and footer
    await loadComponent('header-container', 'header.html');
    await loadComponent('footer-container', 'footer.html');

    //get DOM elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn'); // <-- ADD THIS LINE
    const viewBookshelfBtn = document.getElementById('view-bookshelf');
    const closeModal = document.querySelector('.close-modal');
    const bookModal = document.getElementById('book-modal');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    import('./js/search.js').then(({ searchBooks }) => {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
    
            if (!document.getElementById('search-results')) {
                //save query and redirecting
                localStorage.setItem('pendingSearch', query);
    
                const redirectPath = window.location.pathname.includes('/pages/') ? '../index.html' : './index.html';
                window.location.href = redirectPath;
            } else {
                if (query) {
                    searchBooks();
                }
            }
        });
    
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
    
                if (!document.getElementById('search-results')) {
                    // Save query before redirecting
                    localStorage.setItem('pendingSearch', query);
    
                    const redirectPath = window.location.pathname.includes('/pages/') ? '../index.html' : './index.html';
                    window.location.href = redirectPath;
                } else {
                    if (query) {
                        searchBooks();
                    }
                }
            }
        });
    
        // After attaching listeners, check if there is a pending search
        const pendingSearch = localStorage.getItem('pendingSearch');
        if (pendingSearch && document.getElementById('search-results')) {
            searchInput.value = pendingSearch; // show the text inside the input
            searchBooks(); // run the search
            localStorage.removeItem('pendingSearch'); // clear it after search
        }
    });
    

    import('./js/render.js').then(({ renderBookshelf }) => {
        viewBookshelfBtn.addEventListener('click', () => {
            document.getElementById('search-results').style.display = 'none';
            document.getElementById('bookshelf-results').style.display = 'block';
            renderBookshelf();
        });

        closeModal.addEventListener('click', () => bookModal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === bookModal) bookModal.style.display = 'none';
        });

        renderBookshelf();
    });

    //dark mode toggle
    document.body.classList.remove('light-mode');

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');

        const icon = themeToggleBtn.querySelector('i');
        if (document.body.classList.contains('light-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

document.addEventListener('DOMContentLoaded', init);
