/* Dojo Zen de Lisboa — shared JS */

// ── Night mode ─────────────────────────────────────────────
// Apply immediately (before paint) based on time or saved preference
(function () {
  const saved = localStorage.getItem('dzl-night');
  const h = new Date().getHours();
  const autoNight = h >= 21 || h < 7;
  if (saved === '1' || (saved === null && autoNight)) {
    document.documentElement.classList.add('night');
  }
}());

// Inject toggle button into header and wire up click
const siteHeader = document.getElementById('site-header');
if (siteHeader && !document.getElementById('night-toggle')) {
  const btn = document.createElement('button');
  btn.id = 'night-toggle';
  btn.className = 'night-toggle';
  btn.setAttribute('aria-label', 'Modo nocturno');
  btn.setAttribute('title', 'Modo nocturno');
  btn.innerHTML =
    '<svg class="icon-moon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' +
    '<svg class="icon-sun"  width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/></svg>';
  const hamburger = document.getElementById('hamburger');
  siteHeader.insertBefore(btn, hamburger || null);
  btn.addEventListener('click', () => {
    const on = document.documentElement.classList.toggle('night');
    localStorage.setItem('dzl-night', on ? '1' : '0');
  });
}

// ── Hamburger nav ───────────────────────────────────────────
const ham = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
if (ham && mobileNav) {
  ham.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    ham.setAttribute('aria-expanded', open);
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
}

// ── Parallax image sections ────────────────────────────────
(function () {
  const imgs = document.querySelectorAll('.parallax-img');
  if (!imgs.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const SPEED = 0.2;
  let ticking = false;

  function update() {
    imgs.forEach(img => {
      const wrap = img.parentElement;
      const rect = wrap.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      const mid = rect.top + rect.height / 2 - window.innerHeight / 2;
      img.style.transform = `translateY(calc(-50% + ${(mid * SPEED).toFixed(2)}px))`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update();
}());

// ── Fade-up on scroll ───────────────────────────────────────
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => io.observe(el));
}

// ── Ajax forms ──────────────────────────────────────────────
document.querySelectorAll('#contact-form, .ajax-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const wrap = form.closest('[data-form-wrap]') || form.parentElement;
    const success = wrap.querySelector('.form-success');
    const errBox  = wrap.querySelector('.form-error-box');
    const origLabel = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'A enviar…';
    errBox && (errBox.style.display = 'none');

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data,
      });
      if (res.ok) {
        form.style.display = 'none';
        success && (success.style.display = 'block');
      } else {
        throw new Error('server');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = origLabel;
      if (errBox) errBox.style.display = 'block';
    }
  });
});
