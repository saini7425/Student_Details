const form = document.getElementById('studentForm');
const message = document.getElementById('message');
const summary = document.getElementById('summary');
const summaryList = document.getElementById('summaryList');
const cancelBtn = document.getElementById('cancelBtn');

// Validation rule for each field: returns true, or an error message
const rules = {
  name:   v => /^[A-Za-z][A-Za-z .'-]{1,59}$/.test(v) || 'Enter your full name (letters only).',
  email:  v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
  dob:    v => (v && new Date(v) < new Date()) || 'Choose a valid date of birth.',
  phone:  v => /^[6-9]\d{9}$/.test(v) || 'Enter a valid 10-digit mobile number.',
  course: v => !!v || 'Select a course.'
};

const labels = {
  name: 'Full name',
  email: 'Email',
  dob: 'Date of birth',
  phone: 'Phone number',
  course: 'Course'
};

function showError(name, text) {
  form.querySelector('.error[data-for="' + name + '"]').textContent = text || '';
  form.elements[name].classList.toggle('invalid', !!text);
}

function clearMessages() {
  message.className = '';
  message.textContent = '';
  summary.style.display = 'none';
  Object.keys(rules).forEach(name => showError(name, ''));
}

// Submit button
form.addEventListener('submit', function (event) {
  event.preventDefault();
  clearMessages();

  let valid = true;
  const data = {};

  Object.keys(rules).forEach(name => {
    const value = form.elements[name].value.trim();
    const result = rules[name](value);
    if (result !== true) {
      showError(name, result);
      valid = false;
    }
    data[name] = value;
  });

  if (!valid) {
    message.className = 'info';
    message.textContent = 'Please fix the highlighted fields and submit again.';
    return;
  }

  // Later: send `data` to your Spring Boot API here using fetch() with POST.
  message.className = 'ok';
  message.textContent = 'Student details submitted successfully.';

  summaryList.innerHTML = '';
  Object.keys(labels).forEach(key => {
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = labels[key];
    dd.textContent = data[key];
    summaryList.append(dt, dd);
  });
  summary.style.display = 'block';
});

// Cancel button
cancelBtn.addEventListener('click', function () {
  if (!confirm('Discard the entered details?')) return;
  form.reset();
  clearMessages();
  message.className = 'info';
  message.textContent = 'Form cancelled. All entered details were cleared.';
});