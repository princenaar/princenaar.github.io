'use strict';

const header = document.querySelector('[data-header]');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
    document.body.classList.toggle('menu-open', !open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); document.body.classList.remove('menu-open');
  }));
}

const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 40);
onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

const items = document.querySelectorAll('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) items.forEach(el => el.classList.add('is-visible'));
else {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  items.forEach(el => observer.observe(el));
}

document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const target = document.querySelector(link.getAttribute('href'));
  if (target) { event.preventDefault(); target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }); }
}));

document.querySelectorAll('[data-video]').forEach(container => {
  const button = container.querySelector('button');
  if (!button) return;
  button.addEventListener('click', () => {
    const id = container.dataset.video;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`;
    iframe.title = 'Lancement de la plateforme e-DRHSanté';
    iframe.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    container.replaceChildren(iframe);
  });
});
