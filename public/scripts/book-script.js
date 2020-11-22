const REQUEST_TIMEOUT = 2000; // ms

const bookTable = document.getElementById('book-table');
const bookTableBody = bookTable.getElementsByTagName('tbody')[0];
const loadingAlert = document.getElementById('loading-alert');
const loadingSpinner = document.getElementById('loading-spinner');

function loadBooks() {
  bookTable.classList.add('d-none');
  loadingAlert.classList.add('d-none');
  loadingSpinner.classList.remove('d-none');

  const abortController = new AbortController();
  const timer = setTimeout(() => {
    abortController.abort();
  }, REQUEST_TIMEOUT);

  fetch('/api/books', { signal: abortController.signal })
    .then((response) => response.json())
    .then((json) => {
      bookTableBody.innerHTML = '';
      const books = json.books;
      books.forEach((book) => {
        const row = document.createElement('tr');
        const authorCol = document.createElement('td');
        authorCol.textContent = book.author;
        row.appendChild(authorCol);
        const titleCol = document.createElement('td');
        titleCol.textContent = book.title;
        row.appendChild(titleCol);
        const yearCol = document.createElement('td');
        yearCol.textContent = book.year;
        row.appendChild(yearCol);
        bookTableBody.appendChild(row);
      });
      bookTable.classList.remove('d-none');
    })
    .catch((error) => {
      loadingAlert.classList.remove('d-none');
      console.error(error);
    })
    .finally(() => {
      loadingSpinner.classList.add('d-none');
      clearTimeout(timer);
    });
}

loadBooks();
