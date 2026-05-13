/* Dojo Zen de Lisboa — shared JS */

// Hamburger nav
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

// Fade-up on scroll
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => io.observe(el));
}

// Ajax forms — handles contact-form and any .ajax-form
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
