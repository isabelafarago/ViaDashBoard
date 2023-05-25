const checkbox = document.getElementById('theme');
const body = document.body;

checkbox.addEventListener('change', function() {
  if (this.checked) {
    body.classList.add('light-mode');
  } else {
    body.classList.remove('light-mode');
  }
});
