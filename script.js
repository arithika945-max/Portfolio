const countdown = document.querySelector("#countdown");
const countdownTarget = new Date(countdown.dataset.date).getTime();
let countdownInterval;

function updateCountdown() {
  const remaining = countdownTarget - Date.now();

  if (remaining <= 0) {
    countdown.innerHTML = '<p class="countdown-finished">The workshop is happening now!</p>';
    window.clearInterval(countdownInterval);
    return;
  }

  const units = {
    days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
    hours: Math.floor((remaining / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((remaining / (1000 * 60)) % 60),
    seconds: Math.floor((remaining / 1000) % 60)
  };

  Object.entries(units).forEach(([unit, value]) => {
    document.querySelector(`#${unit}`).textContent = String(value).padStart(2, "0");
  });
}

updateCountdown();
countdownInterval = window.setInterval(updateCountdown, 1000);

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navLinks.classList.toggle("is-open", !isOpen);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("is-open");
  }
});

const form = document.querySelector("#registration-form");
const formMessage = document.querySelector("#form-message");
const requiredFields = ["name", "email", "department", "workshop"];

function setFieldError(field, message) {
  const input = document.querySelector(`#${field}`);
  const error = document.querySelector(`#${field}-error`);
  input.setAttribute("aria-invalid", String(Boolean(message)));
  error.textContent = message;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent = "";
  formMessage.classList.remove("error");

  const values = Object.fromEntries(new FormData(form).entries());
  const errors = {
    name: values.name.trim().length < 2 ? "Please enter your name (at least 2 characters)." : "",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) ? "" : "Enter a valid email address.",
    department: values.department ? "" : "Please choose your department.",
    workshop: values.workshop ? "" : "Please choose a workshop."
  };

  requiredFields.forEach((field) => setFieldError(field, errors[field]));

  if (Object.values(errors).some(Boolean)) {
    formMessage.textContent = "Please check the highlighted fields.";
    formMessage.classList.add("error");
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  formMessage.textContent = `You're on the list, ${values.name.trim()}! We look forward to seeing you.`;
  form.reset();
});

requiredFields.forEach((field) => {
  document.querySelector(`#${field}`).addEventListener("input", () => setFieldError(field, ""));
  document.querySelector(`#${field}`).addEventListener("change", () => setFieldError(field, ""));
});
