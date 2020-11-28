const REQUEST_TIMEOUT = 2000; // ms

const phoneTable = document.getElementById('phone-table');
const phoneTableBody = phoneTable.getElementsByTagName('tbody')[0];
const loadingAlert = document.getElementById('loading-alert');
const loadingSpinner = document.getElementById('loading-spinner');

function loadPhones() {
  phoneTable.classList.add('d-none');
  loadingAlert.classList.add('d-none');
  loadingSpinner.classList.remove('d-none');

  const abortController = new AbortController();
  const timer = setTimeout(() => {
    abortController.abort();
  }, REQUEST_TIMEOUT);

  fetch('/api/phone', { signal: abortController.signal })
    .then((response) => response.json())
    .then((json) => {
      phoneTableBody.innerHTML = '';
      const phones = json.phones;
      phones.forEach((phone) => {
        const row = document.createElement('tr');
        const authorCol = document.createElement('td');
        authorCol.textContent = phone.lastName;
        row.appendChild(authorCol);
        const titleCol = document.createElement('td');
        titleCol.textContent = phone.firstName;
        row.appendChild(titleCol);
        const birthDayCol = document.createElement('td');
        const datesplitted = phone.birthDate.toString().split('T')
        birthDayCol.textContent = datesplitted[0];
        row.appendChild(birthDayCol);
        const phoneCol = document.createElement('td');
        phoneCol.textContent = phone.phone;
        row.appendChild(phoneCol);
        const emailCol = document.createElement('td');
        emailCol.textContent = phone.email;
        row.appendChild(emailCol);
        phoneTableBody.appendChild(row);
      });
      phoneTable.classList.remove('d-none');
    })
    .catch((error) => {
      loadingAlert.classList.remove('d-none');
    })
    .finally(() => {
      loadingSpinner.classList.add('d-none');
      clearTimeout(timer);
    });
}

loadPhones();

const phoneForm = document.getElementById('phone-form');
const lastNameInput = document.getElementById('lastNameInput');
const firstNameInput = document.getElementById('firstNameInput');
const birthDateInput = document.getElementById('birthDateInput');
const phoneInput = document.getElementById('phoneInput');
const emailInput = document.getElementById('emailInput');
const sendingFailure = document.getElementById('sending-failure');

function sendForm() {
  lastNameInput.setAttribute('disabled', true);
  firstNameInput.setAttribute('disabled', true);
  birthDateInput.setAttribute('disabled', true);
  phoneInput.setAttribute('disabled', true);
  emailInput.setAttribute('disabled', true);

  const data = {
    lastName: lastNameInput.value,
    firstName: firstNameInput.value,
    birthDate: birthDateInput.value,
    phone: phoneInput.value,
    email: emailInput.value,
  };

  const abortController = new AbortController();
  const timer = setTimeout(() => {
    abortController.abort();
  }, REQUEST_TIMEOUT);

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');

  fetch('/api/phone', {
    method: 'POST',
    body: JSON.stringify(data),
    headers,
    signal: abortController.signal,
  })
    .then((response) => {
      if (response.ok) {
        loadPhones();
        phoneForm.reset();
        phoneForm.classList.remove('was-validated');
        window.scrollTo(0, 0);
      }
    })
    .catch((error) => {
      sendingFailure.classList.remove('d-none');
    })
    .finally(() => {
      lastNameInput.removeAttribute('disabled');
      firstNameInput.removeAttribute('disabled');
      birthDateInput.removeAttribute('disabled');
      phoneInput.removeAttribute('disabled');
      emailInput.removeAttribute('disabled');
      clearTimeout(timer);
    });
}

phoneForm.addEventListener('submit', (event) => {
  sendingFailure.classList.add('d-none');
  event.preventDefault();
  event.stopPropagation();
  if (phoneForm.checkValidity()) {
    sendForm();
  }

  phoneForm.classList.add('was-validated');
});

const refreshButton = document.getElementById('refresh-button');

refreshButton.addEventListener('click', (event) => {
  loadPhones();
});
