/**
 * Ahmed Elmor — Interactive CV
 * script.js
 *
 * Features implemented:
 *  Option 1 — Contact Form with Validation
 *  Option 2 — Show / Hide Skills Section
 *  Option 3 — Dark Mode / Light Mode Toggle
 *  Option 4 — Dynamic Skills List
 *  Option 5 — Welcome Message (modal on page load)
 *  Option 6 — Interactive Experience Section (expand/collapse details)
 */

/* ─────────────────────────────────────────────────────────────
   OPTION 5 — Welcome Modal
   Shows once per session when the page loads.
───────────────────────────────────────────────────────────── */
(function initWelcomeModal() {
  const overlay = document.getElementById('welcome-overlay');
  const closeBtn = document.getElementById('welcome-close');

  // Show the modal on page load (only once per session)
  if (!sessionStorage.getItem('welcomed')) {
    overlay.classList.add('visible');
  }

  // Close modal when button is clicked
  closeBtn.addEventListener('click', function () {
    overlay.classList.remove('visible');
    sessionStorage.setItem('welcomed', 'true');
  });

  // Also close if user clicks the dark backdrop
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      overlay.classList.remove('visible');
      sessionStorage.setItem('welcomed', 'true');
    }
  });
})();


/* ─────────────────────────────────────────────────────────────
   OPTION 3 — Dark / Light Mode Toggle
   Switches a CSS class on <body> and saves preference.
───────────────────────────────────────────────────────────── */
(function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const icon      = document.getElementById('theme-icon');
  const body      = document.body;

  // Restore saved theme preference from previous visit
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.replace('light-mode', 'dark-mode');
    icon.textContent = '☀️';
  }

  toggleBtn.addEventListener('click', function () {
    const isDark = body.classList.contains('dark-mode');

    if (isDark) {
      // Switch to light mode
      body.classList.replace('dark-mode', 'light-mode');
      icon.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    } else {
      // Switch to dark mode
      body.classList.replace('light-mode', 'dark-mode');
      icon.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    }
  });
})();


/* ─────────────────────────────────────────────────────────────
   OPTION 2 — Show / Hide Section Toggle
   Targets any button with class "toggle-section-btn".
───────────────────────────────────────────────────────────── */
(function initSectionToggles() {
  const toggleBtns = document.querySelectorAll('.toggle-section-btn');

  toggleBtns.forEach(function (btn) {
    const targetId = btn.getAttribute('data-target');
    const target   = document.getElementById(targetId);

    // Set initial max-height so CSS transitions work
    target.style.maxHeight = target.scrollHeight + 'px';
    target.style.overflow  = 'hidden';
    target.style.transition = 'max-height 0.4s ease';

    btn.addEventListener('click', function () {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        // Collapse the section
        target.style.maxHeight = '0';
        btn.textContent = 'Show ▼';
        btn.setAttribute('aria-expanded', 'false');
      } else {
        // Expand the section
        target.style.maxHeight = target.scrollHeight + 'px';
        btn.textContent = 'Hide ▲';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();


/* ─────────────────────────────────────────────────────────────
   OPTION 4 — Dynamic Skills List
   Adds a new skill tag to the Technical skills group.
───────────────────────────────────────────────────────────── */
(function initDynamicSkills() {
  const input     = document.getElementById('new-skill-input');
  const addBtn    = document.getElementById('add-skill-btn');
  const skillList = document.getElementById('technical-skills');
  const feedback  = document.getElementById('skill-feedback');

  function addSkill() {
    const skillName = input.value.trim();

    // Validate: must not be empty
    if (!skillName) {
      showFeedback('Please enter a skill name.', false);
      return;
    }

    // Validate: no duplicate skills (case-insensitive)
    const existing  = skillList.querySelectorAll('.skill-tag');
    const duplicate = Array.from(existing).some(function (tag) {
      return tag.textContent.toLowerCase() === skillName.toLowerCase();
    });

    if (duplicate) {
      showFeedback('"' + skillName + '" is already listed.', false);
      return;
    }

    // Create new skill tag element
    const tag = document.createElement('span');
    tag.classList.add('skill-tag', 'skill-tag--new');
    tag.textContent = skillName;
    skillList.appendChild(tag);

    // Trigger the entry animation on the next frame
    requestAnimationFrame(function () {
      tag.classList.add('skill-tag--visible');
    });

    // Clear the input field and show success
    input.value = '';
    showFeedback('"' + skillName + '" added!', true);
  }

  // Show a feedback message (success or error)
  function showFeedback(message, isSuccess) {
    feedback.textContent = message;
    feedback.className   = 'skill-feedback ' + (isSuccess ? 'skill-feedback--success' : 'skill-feedback--error');

    // Auto-clear message after 3 seconds
    setTimeout(function () {
      feedback.textContent = '';
      feedback.className   = 'skill-feedback';
    }, 3000);
  }

  addBtn.addEventListener('click', addSkill);

  // Allow pressing Enter to add skill
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  });
})();


/* ─────────────────────────────────────────────────────────────
   OPTION 1 — Contact Form with Validation
   Validates name, email format, and message before submission.
───────────────────────────────────────────────────────────── */
(function initContactForm() {
  const form         = document.getElementById('contact-form');
  const nameInput    = document.getElementById('form-name');
  const emailInput   = document.getElementById('form-email');
  const messageInput = document.getElementById('form-message');
  const nameError    = document.getElementById('name-error');
  const emailError   = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');
  const successMsg   = document.getElementById('form-success');

  // Regex to validate a proper email address format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(input, errorEl, message) {
    errorEl.textContent = message;
    input.classList.add('input--error');
    input.classList.remove('input--valid');
  }

  function clearError(input, errorEl) {
    errorEl.textContent = '';
    input.classList.remove('input--error');
    input.classList.add('input--valid');
  }

  // Live validation feedback while the user types
  nameInput.addEventListener('input', function () {
    if (nameInput.value.trim()) clearError(nameInput, nameError);
  });

  emailInput.addEventListener('input', function () {
    if (emailRegex.test(emailInput.value.trim())) clearError(emailInput, emailError);
  });

  messageInput.addEventListener('input', function () {
    if (messageInput.value.trim()) clearError(messageInput, messageError);
  });

  // Form submit — validate all fields
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent actual page navigation
    let isValid = true;
    successMsg.textContent = '';
    successMsg.className = 'form-success';

    // Check Name
    if (!nameInput.value.trim()) {
      showError(nameInput, nameError, 'Name is required.');
      isValid = false;
    } else {
      clearError(nameInput, nameError);
    }

    // Check Email
    if (!emailInput.value.trim()) {
      showError(emailInput, emailError, 'Email is required.');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, emailError, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(emailInput, emailError);
    }

    // Check Message
    if (!messageInput.value.trim()) {
      showError(messageInput, messageError, 'Message cannot be empty.');
      isValid = false;
    } else {
      clearError(messageInput, messageError);
    }

    // If all valid, show success and reset the form
    if (isValid) {
      successMsg.textContent = '✅ Thank you! Your message has been sent successfully.';
      successMsg.className   = 'form-success form-success--visible';
      form.reset();
      [nameInput, emailInput, messageInput].forEach(function (el) {
        el.classList.remove('input--valid');
      });
    }
  });
})();


/* ─────────────────────────────────────────────────────────────
   OPTION 6 — Interactive Experience Section
   Expands / collapses job detail bullets without page reload.
───────────────────────────────────────────────────────────── */
(function initExperienceDetails() {
  const detailBtns = document.querySelectorAll('.details-btn');

  detailBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = btn.getAttribute('data-target');
      const details  = document.getElementById(targetId);
      const isOpen   = btn.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        // Collapse the detail panel
        details.hidden = true;
        btn.textContent = 'View Details ▾';
        btn.setAttribute('aria-expanded', 'false');
      } else {
        // Expand the detail panel
        details.hidden = false;
        btn.textContent = 'Hide Details ▴';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
