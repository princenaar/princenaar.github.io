'use strict';

document.documentElement.classList.add('js');

const header = document.querySelector('[data-header]');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobileQuery = window.matchMedia('(max-width: 800px)');
let lastFocused = null;

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function syncClosedMenu() {
  if (!toggle || !nav) return;
  const mobile = mobileQuery.matches;
  const open = toggle.getAttribute('aria-expanded') === 'true';
  if (!mobile) {
    nav.classList.remove('is-open');
    nav.removeAttribute('aria-hidden');
    nav.removeAttribute('inert');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    return;
  }
  nav.setAttribute('aria-hidden', String(!open));
  if (open) nav.removeAttribute('inert');
  else nav.setAttribute('inert', '');
}

function openMenu() {
  if (!toggle || !nav) return;
  lastFocused = document.activeElement;
  toggle.setAttribute('aria-expanded', 'true');
  toggle.querySelector('.menu-label').textContent = toggle.dataset.closeLabel || 'Fermer le menu';
  nav.classList.add('is-open');
  nav.setAttribute('aria-hidden', 'false');
  nav.removeAttribute('inert');
  document.body.classList.add('menu-open');
  const first = nav.querySelector(focusableSelector);
  if (first) first.focus();
}

function closeMenu(restoreFocus = true) {
  if (!toggle || !nav) return;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.querySelector('.menu-label').textContent = toggle.dataset.openLabel || 'Ouvrir le menu';
  nav.classList.remove('is-open');
  nav.setAttribute('aria-hidden', 'true');
  nav.setAttribute('inert', '');
  document.body.classList.remove('menu-open');
  if (restoreFocus && lastFocused instanceof HTMLElement) lastFocused.focus();
}

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    if (toggle.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    if (mobileQuery.matches) closeMenu(false);
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      event.preventDefault();
      closeMenu();
    }
    if (event.key === 'Tab' && toggle.getAttribute('aria-expanded') === 'true') {
      const items = [...nav.querySelectorAll(focusableSelector), toggle];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });
  mobileQuery.addEventListener('change', syncClosedMenu);
  syncClosedMenu();
}

const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 32);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const revealItems = document.querySelectorAll('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) revealItems.forEach(el => el.classList.add('is-visible'));
else {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: .1 });
  revealItems.forEach(el => observer.observe(el));
}

document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
}));

document.querySelectorAll('[data-video]').forEach(container => {
  const button = container.querySelector('button');
  if (!button) return;
  button.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(container.dataset.video)}?rel=0`;
    iframe.title = button.dataset.videoTitle || 'Vidéo';
    iframe.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    container.replaceChildren(iframe);
  });
});
