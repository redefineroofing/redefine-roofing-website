/* ============================================================
   REDEFINE ROOFING — MAIN JS
   ============================================================ */

/* ---------- Hero Video Text Fade ---------- */
(function () {
  const video   = document.querySelector('.hero-video');
  const content = document.querySelector('.hero-content');
  if (!video || !content) return;

  const HIDE_START = 24.5;
  const HIDE_END   = 28.2;

  let hidden = false;

  video.addEventListener('timeupdate', () => {
    const t = video.currentTime;
    const shouldHide = t >= HIDE_START && t <= HIDE_END;

    if (shouldHide && !hidden) {
      content.style.transition = 'opacity 1s ease';
      content.style.opacity    = '0';
      content.style.pointerEvents = 'none';
      hidden = true;
    } else if (!shouldHide && hidden) {
      content.style.transition = 'opacity 1s ease';
      content.style.opacity    = '1';
      content.style.pointerEvents = '';
      hidden = false;
    }
  });
})();

/* ---------- Instant Estimate Modal ---------- */
(function () {
  const modal    = document.getElementById('estimatorModal');
  const openBtns = document.querySelectorAll('#instantEstimateBtn, .js-instant-estimate');
  if (!modal || !openBtns.length) return;

  const closeBtn = document.getElementById('estimatorClose');
  const overlay  = document.getElementById('estimatorOverlay');
  const iframe   = modal.querySelector('iframe');

  function openModal() {
    // Lazy-load the estimator iframe the first time the modal opens
    if (iframe && !iframe.getAttribute('src') && iframe.dataset.src) {
      iframe.src = iframe.dataset.src;
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
})();

/* ---------- Trust Bar Auto-Fit ---------- */
(function () {
  const items = document.querySelector('.trust-items');
  if (!items) return;

  const MIN_SCALE = 0.75;
  const STEP = 0.05;

  function fit() {
    items.classList.remove('trust-icons-only');
    let scale = 1;
    items.style.setProperty('--trust-scale', scale);

    while (items.scrollWidth > items.clientWidth && scale > MIN_SCALE) {
      scale = Math.round((scale - STEP) * 100) / 100;
      items.style.setProperty('--trust-scale', scale);
    }

    if (items.scrollWidth > items.clientWidth) {
      items.classList.add('trust-icons-only');
    }
  }

  fit();
  window.addEventListener('resize', fit);
})();

/* ---------- Sticky Navbar ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ---------- Mobile Menu ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ---------- Nav Dropdowns (mobile toggle) ---------- */
document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
  const toggle = item.querySelector('.nav-drop-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.nav-item.has-dropdown.open').forEach(other => {
      if (other !== item) other.classList.remove('open');
    });
    item.classList.toggle('open');
  });
});

/* ---------- Gallery Slideshows ---------- */
document.querySelectorAll('.gallery-slideshow').forEach(slideshow => {
  const slides = slideshow.querySelectorAll('img');
  if (slides.length < 2) return;

  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 3000);
});

/* ---------- Gallery Filters ---------- */
const filterBtns  = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !match);
    });
  });
});

/* ---------- Scroll Fade-In Animations ---------- */
const fadeEls = document.querySelectorAll(
  '.service-card, .testimonial-card, .blog-card, .gallery-item, .value-item, .about-text > p'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

/* ---------- Contact Form (Netlify Forms) ---------- */
const form = document.getElementById('contactForm');
if (form) {
const submitBtn  = document.getElementById('submitBtn');
const btnText    = document.getElementById('btnText');
const btnSpinner = document.getElementById('btnSpinner');
const successMsg = document.getElementById('formSuccess');
const errorMsg   = document.getElementById('formError');

const fields = {
  firstName : { el: document.getElementById('firstName'), errEl: document.getElementById('firstNameError'), validate: v => v.trim().length >= 1 ? '' : 'First name is required.' },
  lastName  : { el: document.getElementById('lastName'),  errEl: document.getElementById('lastNameError'),  validate: v => v.trim().length >= 1 ? '' : 'Last name is required.' },
  email     : { el: document.getElementById('email'),     errEl: document.getElementById('emailError'),     validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.' },
  phone     : { el: document.getElementById('phone'),     errEl: document.getElementById('phoneError'),     validate: v => v.trim().length >= 7 ? '' : 'Please enter a valid phone number.' },
  service   : { el: document.getElementById('service'),   errEl: document.getElementById('serviceError'),   validate: v => v !== '' ? '' : 'Please select a service.' },
  consent   : { el: document.getElementById('consent'),   errEl: document.getElementById('consentError'),   validate: v => v ? '' : 'You must agree to be contacted.' },
};

function validateField(key) {
  const { el, errEl, validate } = fields[key];
  const value = key === 'consent' ? el.checked : el.value;
  const msg = validate(value);
  errEl.textContent = msg;
  el.classList.toggle('error', msg !== '');
  return msg === '';
}

Object.keys(fields).forEach(key => {
  const { el } = fields[key];
  const event = el.type === 'checkbox' ? 'change' : 'input';
  el.addEventListener(event, () => validateField(key));
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const allValid = Object.keys(fields).map(validateField).every(Boolean);
  if (!allValid) return;

  // Show loading state
  btnText.classList.add('hidden');
  btnSpinner.classList.remove('hidden');
  submitBtn.disabled = true;
  successMsg.classList.add('hidden');
  errorMsg.classList.add('hidden');

  // Netlify Forms: POST urlencoded form data (form-name is a hidden input)
  try {
    const response = await fetch('/', {
      method : 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body   : new URLSearchParams(new FormData(form)).toString(),
    });

    if (response.ok) {
      form.reset();
      successMsg.classList.remove('hidden');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      throw new Error('Server error');
    }
  } catch {
    errorMsg.classList.remove('hidden');
    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } finally {
    btnText.classList.remove('hidden');
    btnSpinner.classList.add('hidden');
    submitBtn.disabled = false;
  }
});
} /* end if (form) */

/* ---------- Smooth Scroll offset for fixed nav ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
