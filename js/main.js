/* ================================================================
   KINGSTON 3 CONSULTING — MAIN JAVASCRIPT
   Booking modal · VSL · Scroll reveal · Nav · Forms
   ================================================================ */

'use strict';

// ---- CONFIG ----
const CALENDLY  = 'https://calendly.com/fabianlyon2312';
// Paste your VSL video URL here (YouTube embed or direct MP4)
// YouTube embed format: https://www.youtube.com/embed/VIDEO_ID?autoplay=1
const VSL_URL   = ''; // e.g. 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'

// ================================================================
// BOOKING MODAL
// ================================================================
(function initBookingModal() {
  // Inject modal HTML once
  const modalHTML = `
  <div class="modal-overlay" id="bookingModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <div class="modal">
      <button class="modal__close" id="modalClose" aria-label="Close booking form">✕</button>
      <div class="modal__info">
        <img src="/assets/logo.png" alt="Kingston 3 Consulting" class="modal__info-logo" />
        <h2 class="modal__info-headline" id="modalTitle">
          Let's build your<br /><em>narrative.</em>
        </h2>
        <p class="modal__info-sub">
          This work is not about giving people a voice. It's about making sure the voice they already have is finally heard — clearly, fairly, and in the right places.
        </p>
        <div class="modal__trust">
          <div class="modal__trust-item">Complimentary 30-min discovery call</div>
          <div class="modal__trust-item">Every inquiry reviewed personally by Fabian</div>
          <div class="modal__trust-item">Limited spots — selective engagements only</div>
          <div class="modal__trust-item">Serving clients globally</div>
        </div>
        <div class="modal__calendly-alt">
          Prefer to jump on a call? <a href="${CALENDLY}" target="_blank" rel="noopener">Book directly on Calendly →</a>
        </div>
      </div>
      <div class="modal__form-panel">
        <h3 class="modal__form-title">Send Your Story</h3>
        <p class="modal__form-sub">Tell Fabian what you're working on. Every message is confidential.</p>
        <form class="form" id="modalForm" data-form novalidate>
          <div class="form__row">
            <div class="form-group">
              <label for="m_firstName">First Name <span class="req">*</span></label>
              <input type="text" id="m_firstName" name="firstName" placeholder="First" required autocomplete="given-name" />
            </div>
            <div class="form-group">
              <label for="m_lastName">Last Name <span class="req">*</span></label>
              <input type="text" id="m_lastName" name="lastName" placeholder="Last" required autocomplete="family-name" />
            </div>
          </div>
          <div class="form-group">
            <label for="m_email">Email Address <span class="req">*</span></label>
            <input type="email" id="m_email" name="email" placeholder="you@example.com" required autocomplete="email" />
          </div>
          <div class="form-group">
            <label for="m_phone">Phone Number</label>
            <input type="tel" id="m_phone" name="phone" placeholder="+1 (555) 000-0000" autocomplete="tel" />
          </div>
          <div class="form-group">
            <label for="m_role">I am a... <span class="req">*</span></label>
            <select id="m_role" name="role" required>
              <option value="" disabled selected>Choose one</option>
              <option value="athlete">Athlete / Sports Professional</option>
              <option value="executive">Executive / Entrepreneur</option>
              <option value="author">Author / Creative</option>
              <option value="public-figure">Public Figure</option>
              <option value="nonprofit">Nonprofit / Organization</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label for="m_story">Tell Me Your Story <span class="req">*</span></label>
            <textarea id="m_story" name="story" rows="4" placeholder="What are you working on? What challenge are you facing?" required></textarea>
          </div>
          <button type="submit" class="btn btn--gold btn--full btn--lg">Send Your Story →</button>
          <div class="form__success" id="modalSuccess" style="display:none;text-align:center;padding:2rem 0">
            <div style="font-size:2.5rem;margin-bottom:0.75rem">✓</div>
            <h4 style="font-family:var(--ff-display);font-size:1.5rem;margin-bottom:0.5rem">Message received.</h4>
            <p style="color:var(--muted);font-size:0.9rem">Fabian reviews every message personally. You'll hear back within 24–48 hours.</p>
            <a href="${CALENDLY}" target="_blank" rel="noopener" class="btn btn--dark" style="margin-top:1.25rem">Book Directly on Calendly →</a>
          </div>
        </form>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const overlay  = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('modalClose');
  const form     = document.getElementById('modalForm');
  const success  = document.getElementById('modalSuccess');

  function openModal(e) {
    const href = this.getAttribute('href') || '';
    // If it's an external Calendly link or explicit contact page link, intercept
    if (href.includes('calendly') || href.includes('contact') || this.dataset.modal === 'booking') {
      if (e) e.preventDefault();
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const firstInput = overlay.querySelector('input:not([type="hidden"])');
        firstInput?.focus();
      }, 350);
    }
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Intercept ALL CTAs that go to calendly or contact page
  function bindCTAs() {
    document.querySelectorAll(
      'a[href*="calendly"], a[href*="contact"], a[href="/contact.html"], .nav__cta, [data-modal="booking"]'
    ).forEach(el => {
      if (!el.dataset.modalBound) {
        el.addEventListener('click', openModal);
        el.dataset.modalBound = 'true';
      }
    });
    // Float CTA button
    const floatCTA = document.querySelector('.float-cta');
    if (floatCTA && !floatCTA.dataset.modalBound) {
      floatCTA.addEventListener('click', openModal);
      floatCTA.dataset.modalBound = 'true';
    }
  }

  // Close handlers
  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Form submit
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const origText = btn.textContent;
    btn.disabled  = true;
    btn.textContent = 'Sending…';

    // TODO: wire to GHL webhook / Zapier
    await new Promise(r => setTimeout(r, 1400));

    form.style.display    = 'none';
    success.style.display = 'block';
    btn.disabled          = false;
    btn.textContent       = origText;

    setTimeout(() => {
      success.style.display = 'none';
      form.style.display    = '';
      form.reset();
      closeModal();
    }, 7000);
  });

  // Bind after DOM ready, then re-bind after any dynamic content
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindCTAs);
  } else {
    bindCTAs();
  }
})();

// ================================================================
// VIDEO MODAL (VSL)
// ================================================================
(function initVideoModal() {
  const videoModalHTML = `
  <div class="video-modal-overlay" id="videoModal" role="dialog" aria-modal="true" aria-label="Watch Fabian Lyon">
    <div class="video-modal">
      <button class="video-modal__close" id="videoModalClose" aria-label="Close video">✕</button>
      <div class="video-modal__frame" id="videoFrame">
        ${VSL_URL
          ? `<iframe src="" data-src="${VSL_URL}" allow="autoplay; fullscreen" allowfullscreen></iframe>`
          : `<div class="video-placeholder">
              <strong>VSL Coming Soon</strong>
              <span>Paste your video URL into VSL_URL in js/main.js</span>
            </div>`
        }
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', videoModalHTML);

  const vOverlay  = document.getElementById('videoModal');
  const vClose    = document.getElementById('videoModalClose');
  const vFrame    = document.getElementById('videoFrame');

  function openVideo() {
    vOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Load iframe src on open (autoplay)
    const iframe = vFrame.querySelector('iframe[data-src]');
    if (iframe && !iframe.src) {
      iframe.src = iframe.dataset.src;
    }
  }

  function closeVideo() {
    vOverlay.classList.remove('open');
    document.body.style.overflow = '';
    // Pause video by clearing src
    const iframe = vFrame.querySelector('iframe');
    if (iframe) {
      const saved = iframe.dataset.src || iframe.src;
      iframe.src = '';
      if (!iframe.dataset.src) iframe.dataset.src = saved;
    }
  }

  document.querySelectorAll('[data-vsl]').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); openVideo(); });
  });

  vClose?.addEventListener('click', closeVideo);
  vOverlay?.addEventListener('click', e => { if (e.target === vOverlay) closeVideo(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && vOverlay?.classList.contains('open')) closeVideo(); });
})();

// ================================================================
// NAV: scroll state + mobile toggle
// ================================================================
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
})();

// ================================================================
// FLOATING CTA
// ================================================================
(function initFloatCTA() {
  const btn = document.querySelector('.float-cta');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
})();

// ================================================================
// SCROLL REVEAL
// ================================================================
(function initReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!targets.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        const siblings = parent.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        let delay = 0;
        siblings.forEach((s, i) => { if (s === entry.target) delay = i * 90; });
        setTimeout(() => entry.target.classList.add('visible'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(el => io.observe(el));
})();

// ================================================================
// HERO TEXT STAGGER
// ================================================================
(function initHeroStagger() {
  const hero = document.querySelector('.hero-home__content');
  if (!hero) return;
  const items = hero.querySelectorAll('.hero-home__eyebrow, .hero-home__headline, .vsl-trigger-wrap, .hero-home__sub, .hero-home__actions');
  items.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.8s ease ${0.3 + i * 0.15}s, transform 0.8s ease ${0.3 + i * 0.15}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity   = '1';
      el.style.transform = 'none';
    }));
  });
})();

// ================================================================
// STAT COUNTER ANIMATION
// ================================================================
(function initCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur = 1800, start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(p * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.disconnect();
    }, { threshold: 0.5 });
    io.observe(el);
  });
})();

// ================================================================
// MARQUEE PAUSE ON HOVER
// ================================================================
document.querySelectorAll('.marquee__track').forEach(track => {
  const marquee = track.closest('.marquee');
  marquee?.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  marquee?.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
});

// ================================================================
// CONTACT PAGE NATIVE FORM (not modal)
// ================================================================
document.querySelectorAll('form[data-form]:not(#modalForm)').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn     = form.querySelector('[type="submit"]');
    const success = form.nextElementSibling;
    const origText = btn.textContent;
    btn.disabled  = true;
    btn.textContent = 'Sending…';
    await new Promise(r => setTimeout(r, 1400));
    btn.textContent = '✓ Sent';
    btn.style.background = '#2a9d5c';
    if (success?.classList.contains('form__success')) {
      form.style.display   = 'none';
      success.style.display = 'block';
    }
    form.reset();
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = origText;
      btn.style.background = '';
      if (success?.classList.contains('form__success')) {
        success.style.display = 'none';
        form.style.display    = '';
      }
    }, 5000);
  });
});
