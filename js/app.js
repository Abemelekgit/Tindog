// TinDog interactivity
(function() {
  const docEl = document.documentElement;
  const body = document.body;
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');
  const themeToggle = document.getElementById('theme-toggle');
  const statNumbers = document.querySelectorAll('.stat-number');
  const demoForm = document.getElementById('demoForm');
  const demoSuccess = document.getElementById('demoSuccess');

  // Scroll progress bar
  function updateScrollProgress() {
    const scrollTop = docEl.scrollTop || body.scrollTop;
    const height = docEl.scrollHeight - docEl.clientHeight;
    const scrolled = height ? (scrollTop / height) * 100 : 0;
    if (scrollProgress) {
      scrollProgress.style.width = scrolled + '%';
    }
  }
  document.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // Back to top
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Theme toggle with persistence
  const THEME_KEY = 'tindog-theme';
  function applyTheme(mode) {
    if (mode === 'dark') {
      body.classList.add('dark-mode');
      themeToggle && (themeToggle.textContent = 'Dark');
    } else {
      body.classList.remove('dark-mode');
      themeToggle && (themeToggle.textContent = 'Light');
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', mode === 'dark');
    }
  }

  function toggleTheme() {
    const next = body.classList.contains('dark-mode') ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(saved);
  }

  // Animated counters when in view
  function animateCount(el) {
    const target = parseFloat(el.dataset.target || '0');
    let current = 0;
    const duration = 1200;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      current = target * progress;
      el.textContent = target % 1 === 0 ? Math.round(current) : current.toFixed(1);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (statNumbers.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statNumbers.forEach(el => observer.observe(el));
  }

  // Demo form handling (fake submit)
  if (demoForm && demoSuccess) {
    demoForm.addEventListener('submit', function(event) {
      event.preventDefault();
      demoSuccess.classList.remove('d-none');
      setTimeout(() => {
        demoSuccess.classList.add('d-none');
        $('#demoModal').modal('hide');
        demoForm.reset();
      }, 1600);
    });
  }
})();
