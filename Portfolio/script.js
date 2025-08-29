// ===== Scrollspy (active nav highlighting) =====
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.nav-link')];
const linkById = Object.fromEntries(navLinks.map(a => [a.getAttribute('href').slice(1), a]));

const observer = new IntersectionObserver(entries => {
  let visible = entries
    .filter(e => e.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (visible) {
    const id = visible.target.id;
    navLinks.forEach(l => l.classList.remove('active'));
    linkById[id]?.classList.add('active');
  }
}, { rootMargin: '-30% 0px -55% 0px', threshold: [0.15, 0.33, 0.66, 0.9] });

sections.forEach(sec => observer.observe(sec));

// Fallback: at top and at bottom activate correct link
window.addEventListener('scroll', () => {
  const doc = document.documentElement;
  const atTop = window.scrollY < 10;
  const nearBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 2;

  if (atTop && linkById['home']) {
    navLinks.forEach(l => l.classList.remove('active'));
    linkById['home'].classList.add('active');
  } else if (nearBottom && linkById['contact']) {
    navLinks.forEach(l => l.classList.remove('active'));
    linkById['contact'].classList.add('active');
  }
}, { passive: true });

// ===== Force scroll to top (Home) on reload =====
window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});

window.addEventListener("load", () => {
  if (window.location.hash) {
    history.replaceState(null, null, " ");
    window.scrollTo({ top: 0, behavior: "instant" });
  } else {
    window.scrollTo(0, 0);
  }
});

// ===== Theme toggle =====
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
} else {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);

  // Animate the icon
  themeToggle.classList.add('animating');
  setTimeout(() => themeToggle.classList.remove('animating'), 400);
});

// ===== Mobile nav toggle + overlay + Esc to close =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');

function closeNav() {
  navMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navOverlay.hidden = true;
}

function openNav() {
  navMenu.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  navOverlay.hidden = false;
}

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navOverlay.hidden = !isOpen;
});

navOverlay.addEventListener('click', closeNav);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) closeNav();
});

// Close menu when a nav link is clicked (mobile)
navLinks.forEach(link => link.addEventListener('click', closeNav));

// ===== Back to top smooth scroll with fade-in/out =====
const toTopBtn = document.querySelector('.to-top');
if (toTopBtn) {
  toTopBtn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      toTopBtn.classList.add('visible');
    } else {
      toTopBtn.classList.remove('visible');
    }
  }, { passive: true });
}

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== CTA buttons smooth scroll =====
document.querySelectorAll('.cta-row a').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href').slice(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== Project "Live" buttons with '#' should not jump to top =====
document.querySelectorAll('.project-actions a.live-link').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') {
      e.preventDefault();
      alert('Live demo coming soon. Check the Code link meanwhile!');
    } else if (href.startsWith('http')) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
  });
});

// ===== Contact form (demo) + mailto fallback =====
const contactForm = document.getElementById('contactForm');
const mailtoLink = document.getElementById('mailtoLink');

if (contactForm && mailtoLink) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = encodeURIComponent(data.get('name') || '');
    const email = encodeURIComponent(data.get('email') || '');
    const message = encodeURIComponent(data.get('message') || '');
    alert('Thanks! This demo does not actually send emails. A mailto link will open with your message.');
    const subject = `Portfolio contact from ${name}`;
    const body = `From: ${name} (${email})%0D%0A%0D%0A${message}`;
    window.location.href = `mailto:your-email@example.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  });

  mailtoLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'mailto:your-email@example.com?subject=Hello%20from%20your%20portfolio';
  });
}