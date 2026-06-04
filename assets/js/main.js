(function () {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const header = document.querySelector('[data-site-header]');
  const revealItems = Array.from(document.querySelectorAll('.reveal'));
  const parallaxItems = prefersReducedMotion
    ? []
    : Array.from(document.querySelectorAll('[data-parallax]')).slice(0, 16);
  const faqButtons = Array.from(document.querySelectorAll('.faq-question'));

  function updateHeaderState() {
    if (!header) {
      return;
    }

    header.classList.toggle('is-scrolled', window.scrollY > 18);
  }

  function setupReveal() {
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.08,
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  function setupFaq() {
    faqButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const item = button.closest('.faq-item');

        if (!item) {
          return;
        }

        const willOpen = !item.classList.contains('is-open');
        item.classList.toggle('is-open', willOpen);
        button.setAttribute('aria-expanded', String(willOpen));
      });
    });
  }

  function setupParallax() {
    if (!parallaxItems.length) {
      return;
    }

    let ticking = false;

    function updateParallax() {
      ticking = false;
      const scrollY = window.scrollY;

      parallaxItems.forEach((item) => {
        const speed = Number(item.dataset.parallax || 0.04);
        const y = Math.round(scrollY * speed * 100) / 100;
        item.style.setProperty('--parallax-y', `${y}px`);
      });
    }

    function requestParallaxUpdate() {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateParallax);
    }

    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    updateParallax();
  }

  function bootHero() {
    window.setTimeout(() => {
      document.body.classList.add('is-ready');
      revealItems
        .filter((item) => item.closest('.hero'))
        .forEach((item) => item.classList.add('is-visible'));
    }, 90);
  }

  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();
  setupReveal();
  setupFaq();
  setupParallax();
  bootHero();
})();
