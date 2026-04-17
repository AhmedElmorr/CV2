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


/* ═══════════════════════════════════════════════════════════
   BONUS FEATURES — Added for extra interactivity
═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   FEATURE 1 — Reading Progress Bar
   Thin gold bar at the top showing scroll progress.
───────────────────────────────────────────────────────────── */
(function initReadingProgress() {
  const bar = document.getElementById('reading-progress');

  window.addEventListener('scroll', function () {
    // Total scrollable height = full page height minus visible window
    var scrollTop    = window.scrollY;
    var docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    var progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = progress + '%';
  });
})();


/* ─────────────────────────────────────────────────────────────
   FEATURE 2 — Sticky Navigation Bar
   Slides in from the top after scrolling past the hero.
───────────────────────────────────────────────────────────── */
(function initStickyNav() {
  var nav  = document.getElementById('sticky-nav');
  var hero = document.querySelector('.hero');

  window.addEventListener('scroll', function () {
    var heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    // Show nav once the hero section has scrolled out of view
    if (heroBottom < 0) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }
  });

  // Smooth scroll for nav links
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();


/* ─────────────────────────────────────────────────────────────
   FEATURE 3 — Back to Top Button
   Appears after scrolling down 400px; smooth scrolls to top.
───────────────────────────────────────────────────────────── */
(function initBackToTop() {
  var btn = document.getElementById('back-to-top');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ─────────────────────────────────────────────────────────────
   FEATURE 4 — Typing Animation on Hero Tagline
   Types out the tagline character by character on page load.
───────────────────────────────────────────────────────────── */
(function initTypingAnimation() {
  var target  = document.getElementById('typing-text');
  var cursor  = document.querySelector('.typing-cursor');
  var text    = 'Aspiring event coordinator & MICT student with multicultural experience across continents.';
  var index   = 0;
  var speed   = 35; // milliseconds per character

  // Wait a moment after welcome modal interaction before typing
  setTimeout(function type() {
    if (index < text.length) {
      target.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    } else {
      // Blink cursor a few times then hide it
      setTimeout(function () {
        cursor.style.display = 'none';
      }, 2000);
    }
  }, 800);
})();


/* ─────────────────────────────────────────────────────────────
   FEATURE 5 — Scroll-Triggered Fade-In Animations
   Sections and timeline items animate in as they enter view.
───────────────────────────────────────────────────────────── */
(function initScrollAnimations() {
  // Select all sections and timeline items to animate
  var elements = document.querySelectorAll(
    '.section, .timeline__item, .edu__card, .skills__group'
  );

  // Add the base class that sets them as invisible initially
  elements.forEach(function (el) {
    el.classList.add('fade-in-target');
  });

  // Use IntersectionObserver to trigger animation when element enters viewport
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
        observer.unobserve(entry.target); // animate once only
      }
    });
  }, {
    threshold: 0.12 // trigger when 12% of element is visible
  });

  elements.forEach(function (el) {
    observer.observe(el);
  });
})();


/* ─────────────────────────────────────────────────────────────
   FEATURE 6 — Timeline Filter Buttons
   Filters experience items by tag: All / Professional /
   Extracurricular / Event.
───────────────────────────────────────────────────────────── */
(function initTimelineFilter() {
  var filterBtns = document.querySelectorAll('.filter-btn');
  var items      = document.querySelectorAll('.timeline__item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');

      // Update active button state
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // Show/hide timeline items based on their tag
      items.forEach(function (item) {
        var tag = item.querySelector('.timeline__tag');
        var tagText = tag ? tag.textContent.trim() : '';

        if (filter === 'all' || tagText === filter) {
          item.style.display = '';
          // Re-trigger fade animation for filtered items
          item.classList.remove('fade-in-visible');
          setTimeout(function () {
            item.classList.add('fade-in-visible');
          }, 50);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
})();


/* ─────────────────────────────────────────────────────────────
   FEATURE 7 — Copy Email Button with Toast Notification
   Copies email to clipboard and shows a toast message.
───────────────────────────────────────────────────────────── */
(function initCopyEmail() {
  var toast = document.getElementById('toast');

  document.querySelectorAll('.copy-email-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault(); // don't follow the parent <a> link
      e.stopPropagation();
      var email = btn.getAttribute('data-email');

      // Use the Clipboard API to copy the email
      navigator.clipboard.writeText(email).then(function () {
        showToast('✅ Email copied to clipboard!');
        btn.textContent = '✓';
        setTimeout(function () { btn.textContent = '📋'; }, 2000);
      }).catch(function () {
        showToast('Could not copy — please copy manually.');
      });
    });
  });

  // Helper: display a toast message that auto-dismisses
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(function () {
      toast.classList.remove('visible');
    }, 3000);
  }
})();


/* ─────────────────────────────────────────────────────────────
   FEATURE 8 — Confetti on Successful Form Submission
   Fires a burst of gold/navy confetti when the form is valid.
───────────────────────────────────────────────────────────── */
(function initConfetti() {
  var canvas  = document.getElementById('confetti-canvas');
  var ctx     = canvas.getContext('2d');
  var pieces  = [];
  var running = false;

  // Colour palette matching the CV theme
  var colors = ['#c9a84c', '#e8d5a3', '#0d1b2a', '#1e3050', '#f9f5ee', '#162234'];

  function Piece() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * -canvas.height; // start above viewport
    this.w     = Math.random() * 10 + 5;
    this.h     = Math.random() * 5  + 3;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.tilt  = Math.random() * 10 - 5;
    this.tiltAngle = 0;
    this.tiltSpeed = Math.random() * 0.1 + 0.05;
    this.speed = Math.random() * 3 + 2;
    this.opacity = 1;
  }

  function launchConfetti() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create 150 confetti pieces
    pieces = [];
    for (var i = 0; i < 150; i++) {
      pieces.push(new Piece());
    }

    if (!running) {
      running = true;
      animate();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(function (p, i) {
      p.tiltAngle += p.tiltSpeed;
      p.y         += p.speed;
      p.tilt       = Math.sin(p.tiltAngle) * 12;

      // Fade out pieces near the bottom
      if (p.y > canvas.height * 0.75) {
        p.opacity = Math.max(0, 1 - (p.y - canvas.height * 0.75) / (canvas.height * 0.25));
      }

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.translate(p.x + p.tilt, p.y);
      ctx.rotate(p.tiltAngle);
      ctx.rect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.fill();
      ctx.restore();
    });

    // Remove pieces that have fully fallen off screen
    pieces = pieces.filter(function (p) { return p.y < canvas.height + 20; });

    if (pieces.length > 0) {
      requestAnimationFrame(animate);
    } else {
      running = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Hook into the contact form's success path
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function () {
      // Small delay so validation runs first; confetti fires only if submission succeeds
      setTimeout(function () {
        var successEl = document.getElementById('form-success');
        if (successEl && successEl.classList.contains('form-success--visible')) {
          launchConfetti();
        }
      }, 100);
    });
  }
})();


/* ═══════════════════════════════════════════════════════════
   ASSIGNMENT 3 — API INTEGRATION
   API 1: dummyjson.com/quotes  (random quotes, no key needed)
   API 2: api.github.com        (public repos, no key needed)
═══════════════════════════════════════════════════════════ */

// ── CONFIG: set your GitHub username here ──────────────────
var GITHUB_USERNAME = 'AhmedElmorr';

/* ─────────────────────────────────────────────────────────────
   API 1 — Quotes API
   Fetches a random motivational quote and displays it in the
   hero section. User can request a new quote via button.
───────────────────────────────────────────────────────────── */
(function initQuotesAPI() {
  var loadingEl = document.getElementById('quoteLoading');
  var textEl    = document.getElementById('quoteText');
  var authorEl  = document.getElementById('quoteAuthor');
  var btnEl     = document.getElementById('newQuoteBtn');
  var errorEl   = document.getElementById('quoteError');

  function showEl(el)  { el.classList.remove('hidden'); }
  function hideEl(el)  { el.classList.add('hidden'); }

  async function fetchQuote() {
    // Show loading state, hide previous content
    showEl(loadingEl);
    hideEl(textEl);
    hideEl(authorEl);
    hideEl(btnEl);
    hideEl(errorEl);

    try {
      var response = await fetch('https://dummyjson.com/quotes/random');

      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }

      var data = await response.json();

      // Populate and reveal quote elements
      textEl.textContent   = '\u201C' + data.quote + '\u201D';
      authorEl.textContent = '\u2014 ' + data.author;

      hideEl(loadingEl);
      showEl(textEl);
      showEl(authorEl);
      showEl(btnEl);

    } catch (err) {
      console.error('Quotes API error:', err);
      hideEl(loadingEl);
      showEl(errorEl);
      showEl(btnEl); // allow retry
    }
  }

  // Fetch on load
  fetchQuote();

  // Fetch new quote on button click
  btnEl.addEventListener('click', fetchQuote);
})();


/* ─────────────────────────────────────────────────────────────
   API 2 — GitHub Repositories API
   Fetches the user's public repositories and renders them as
   cards in the Projects section. Handles loading & errors.
───────────────────────────────────────────────────────────── */
(function initGitHubAPI() {
  var gridEl    = document.getElementById('reposGrid');
  var metaEl    = document.getElementById('githubMeta');
  var errorEl   = document.getElementById('reposError');
  var ctaEl     = document.getElementById('reposCta');
  var linkEl    = document.getElementById('githubProfileLink');

  var profileUrl = 'https://github.com/' + GITHUB_USERNAME;
  if (linkEl) linkEl.href = profileUrl;

  // Utility: escape HTML to prevent XSS
  function esc(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  async function fetchRepos() {
    try {
      var response = await fetch(
        'https://api.github.com/users/' + GITHUB_USERNAME + '/repos?sort=updated&per_page=9'
      );

      if (response.status === 404) {
        throw new Error('GitHub user not found: ' + GITHUB_USERNAME);
      }

      if (!response.ok) {
        throw new Error('GitHub API error: ' + response.status);
      }

      var repos = await response.json();

      // Clear loading spinner
      gridEl.innerHTML = '';

      if (!repos.length) {
        metaEl.textContent = 'No public repositories found.';
        return;
      }

      // Update meta line
      metaEl.textContent = repos.length + ' repositories \u00B7 github.com/' + GITHUB_USERNAME;

      // Render each repo as a card
      repos.forEach(function(repo) {
        var card = document.createElement('a');
        card.href      = repo.html_url;
        card.target    = '_blank';
        card.rel       = 'noopener noreferrer';
        card.className = 'repo-card';

        var metaHtml = '';
        if (repo.language) {
          metaHtml += '<span class="repo-card__lang">' + esc(repo.language) + '</span>';
        }
        metaHtml += '<span class="repo-card__stars">' + repo.stargazers_count + '</span>';

        card.innerHTML =
          '<div class="repo-card__name">' + esc(repo.name) + '</div>' +
          '<div class="repo-card__desc">' + esc(repo.description || 'No description provided.') + '</div>' +
          '<div class="repo-card__meta">' + metaHtml + '</div>';

        gridEl.appendChild(card);
      });

      // Show "View all on GitHub" link
      if (ctaEl) ctaEl.classList.remove('hidden');

    } catch (err) {
      console.error('GitHub API error:', err);
      gridEl.innerHTML = '';
      if (errorEl) errorEl.classList.remove('hidden');
      metaEl.textContent = 'Could not load repositories.';
    }
  }

  fetchRepos();
})();
