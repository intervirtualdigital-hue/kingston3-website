/* ================================================================
   KINGSTON 3 CONSULTING — MAIN JAVASCRIPT
   Premium interactions, animations, form handling
   ================================================================ */

'use strict';

// ---- CONSTANTS ----
const CALENDLY = 'https://calendly.com/fabianlyon2312';

// ---- NAV: Scroll state + mobile toggle ----
(function initNav() {
  const nav    = document.querySelector('.nav');
  const burger = document.querySelector('.nav__burger');
  const mobile = document.querySelector('.nav__mobile');
  if (!nav) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  burger?.addEventListener('click', () => {
    const open = mobile.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    burger.setAttribute('aria-expanded', open);
  });

  mobile?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobile.classList.remove('open');
      burger?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active nav link highlight
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__links a[href*="#"]');
  if (sections.length && navLinks.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(l => {
            const href = l.getAttribute('href').split('#')[1];
            l.classList.toggle('active', href === e.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => io.observe(s));
  }
})();

// ---- FLOATING CTA BUTTON ----
(function initFloatCTA() {
  const btn = document.querySelector('.float-cta');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
})();

// ---- SCROLL REVEAL ----
(function initReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger siblings within a grid/flex container
        const parent = entry.target.parentElement;
        const siblings = parent.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        let delay = 0;
        siblings.forEach((s, i) => {
          if (s === entry.target) delay = i * 90;
        });
        setTimeout(() => entry.target.classList.add('visible'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => io.observe(el));
})();

// ---- HERO TEXT STAGGER ----
(function initHeroStagger() {
  const hero = document.querySelector('.hero-home__content');
  if (!hero) return;
  const items = hero.querySelectorAll('.hero-home__eyebrow, .hero-home__headline, .hero-home__sub, .hero-home__actions');
  items.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = `opacity 0.8s cubic-bezier(0,0,0.2,1) ${0.3 + i * 0.15}s, transform 0.8s cubic-bezier(0,0,0.2,1) ${0.3 + i * 0.15}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity   = '1';
      el.style.transform = 'none';
    }));
  });
})();

// ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Close mobile nav if open
    const mobile = document.querySelector('.nav__mobile');
    mobile?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---- CONTACT/INTAKE FORM HANDLING ----
(function initForms() {
  document.querySelectorAll('[data-form]').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn     = form.querySelector('[type="submit"]');
      const success = form.closest('.form-wrap')?.querySelector('.form__success');
      const origText = btn.textContent;

      btn.disabled  = true;
      btn.textContent = 'Sending…';

      const data = Object.fromEntries(new FormData(form));

      // TODO: Replace endpoint with GHL webhook or Zapier
      // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });
      await new Promise(r => setTimeout(r, 1400));

      btn.textContent = '✓ Sent';
      btn.style.background = '#2a9d5c';

      if (success) {
        form.style.display = 'none';
        success.classList.add('visible');
      }

      form.reset();

      setTimeout(() => {
        btn.disabled    = false;
        btn.textContent = origText;
        btn.style.background = '';
        if (success) {
          success.classList.remove('visible');
          form.style.display = '';
        }
      }, 6000);
    });
  });
})();

// ---- STAT COUNTER ANIMATION ----
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur    = 1800;
      const start  = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const val = Math.round(p * target);
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => io.observe(el));
})();

// ---- MARQUEE PAUSE ON HOVER ----
document.querySelectorAll('.marquee__track').forEach(track => {
  track.closest('.marquee')?.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.closest('.marquee')?.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
});

// ---- NEWSLETTER FORM ----
document.querySelectorAll('[data-newsletter]').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button');
    btn.textContent = '✓ Subscribed';
    btn.disabled = true;
    await new Promise(r => setTimeout(r, 2000));
    btn.textContent = 'Subscribe';
    btn.disabled = false;
    form.reset();
  });
});

// ---- LAZY LOAD IMAGES FALLBACK ----
if ('loading' in HTMLImageElement.prototype === false) {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.src = img.dataset.src || img.src;
  });
}
