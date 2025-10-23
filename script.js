// Minimal interactivity
document.addEventListener('DOMContentLoaded', () => {
  // always start at top on reload
  window.scrollTo({ top: 0, behavior: 'instant' });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // subtle parallax for stacked cards
  const stacks = document.querySelectorAll('.card');
  const hero = document.querySelector('.hero');
  if (hero && stacks.length) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      stacks.forEach((el, i) => {
        const depth = (i + 1) * 4;
        el.style.transform = `translate(${x * depth}px, ${y * depth}px) rotate(${(i%2?1:-1)}deg)`;
      });
    });
    hero.addEventListener('mouseleave', () => {
      stacks.forEach((el, i) => {
        el.style.transform = `rotate(${(i%2?1:-1)}deg)`;
      });
    });
  }

  // scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const drawer = document.getElementById('mobileMenu');
  const backdrop = document.querySelector('.menu-backdrop');
  const closeBtn = document.querySelector('.menu-close');
  const openMenu = () => {
    if (!drawer) return;
    drawer.setAttribute('aria-hidden', 'false');
    toggle && toggle.setAttribute('aria-expanded', 'true');
    backdrop && (backdrop.hidden = false);
    drawer.focus({ preventScroll: true });
  };
  const closeMenu = () => {
    if (!drawer) return;
    drawer.setAttribute('aria-hidden', 'true');
    toggle && toggle.setAttribute('aria-expanded', 'false');
    backdrop && (backdrop.hidden = true);
  };
  toggle && toggle.addEventListener('click', openMenu);
  closeBtn && closeBtn.addEventListener('click', closeMenu);
  backdrop && backdrop.addEventListener('click', closeMenu);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  // sticky header shadow on scroll
  const header = document.querySelector('.site-header');
  const setHeaderState = () => {
    if (!header) return;
    if (window.scrollY > 6) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  // circular orbit animation for hero cards
  const orbitCards = document.querySelectorAll('.hero .card');
  const media = document.querySelector('.hero-media');
  if (orbitCards.length === 3 && media) {
    let t = 0;
    const radius = Math.min(media.clientWidth, media.clientHeight) * 0.33;
    const centerX = media.clientWidth - 180;
    const centerY = media.clientHeight * 0.5;
    const speed = 0.015; // radians per frame
    const step = () => {
      t += speed;
      orbitCards.forEach((el, i) => {
        const angle = t + (i * (Math.PI * 2 / 3));
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.transform = `translate(-50%, -50%) rotate(${(i%2?1:-1)}deg)`;
      });
      requestAnimationFrame(step);
    };
    // prepare absolute orbiting
    media.style.position = 'relative';
    orbitCards.forEach((el) => {
      el.style.position = 'absolute';
      el.style.willChange = 'transform, left, top';
    });
    requestAnimationFrame(step);
  }

  // splash intro removal after animation
  const splash = document.getElementById('splash');
  if (splash) {
    // remove after animation completes (1.8s)
    setTimeout(() => {
      splash.remove();
      document.body.classList.remove('splash-active');
    }, 1850);
    // add blur class while splash is active
    document.body.classList.add('splash-active');
  }
});


