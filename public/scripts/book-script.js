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

const bookForm = document.getElementById('book-form');
const authorInput = document.getElementById('authorInput');
const titleInput = document.getElementById('titleInput');
const yearInput = document.getElementById('yearInput');
const sendingFailure = document.getElementById('sending-failure');

function sendForm() {
  authorInput.setAttribute('disabled', true);
  titleInput.setAttribute('disabled', true);
  yearInput.setAttribute('disabled', true);

  const data = {
    author: authorInput.value,
    title: titleInput.value,
    year: yearInput.value,
  };

  const abortController = new AbortController();
  const timer = setTimeout(() => {
    abortController.abort();
  }, REQUEST_TIMEOUT);

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');

  fetch('/api/books', {
    method: 'POST',
    body: JSON.stringify(data),
    headers,
    signal: abortController.signal,
  })
    .then((response) => {
      if (response.ok) {
        loadBooks();
        bookForm.reset();
        bookForm.classList.remove('was-validated');
        window.scrollTo(0, 0);
      }
    })
    .catch((error) => {
      sendingFailure.classList.remove('d-none');
    })
    .finally(() => {
      authorInput.removeAttribute('disabled');
      titleInput.removeAttribute('disabled');
      yearInput.removeAttribute('disabled');
      clearTimeout(timer);
    });
}

bookForm.addEventListener('submit', (event) => {
  sendingFailure.classList.add('d-none');
  event.preventDefault();
  event.stopPropagation();
  if (bookForm.checkValidity()) {
    sendForm();
  }

  bookForm.classList.add('was-validated');
});

loadBooks();
