'use strict';

// ─── AOS (Animate On Scroll) ───────────────────────────────────────────────
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true
});

// ─── PureCounter ──────────────────────────────────────────────────────────
new PureCounter();

// ─── Swiper (home carousel) ───────────────────────────────────────────────
const homeSlider = document.querySelector('.home-slider');
if (homeSlider) {
  new Swiper('.home-slider', {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    effect: 'fade',
    fadeEffect: { crossFade: true },
    pagination: {
      el: '.home-slider .swiper-pagination',
      clickable: true
    }
  });
}

// ─── GLightbox ────────────────────────────────────────────────────────────
if (typeof GLightbox !== 'undefined') {
  GLightbox({ selector: '.glightbox' });
  GLightbox({ selector: '.popup-youtube', type: 'video' });
}

// ─── Full-height hero elements ────────────────────────────────────────────
function setFullHeight() {
  document.querySelectorAll('.js-fullheight').forEach(function(el) {
    el.style.height = window.innerHeight + 'px';
  });
}
setFullHeight();
window.addEventListener('resize', setFullHeight);

// ─── Page loader ──────────────────────────────────────────────────────────
window.addEventListener('load', function() {
  var loader = document.getElementById('ftco-loader');
  if (loader) loader.classList.remove('show');
});

// ─── Navbar scroll behaviour (replaces jQuery Stellar + scroll) ───────────
var navbar = document.querySelector('.ftco_navbar');
window.addEventListener('scroll', function() {
  var st = window.scrollY || window.pageYOffset;
  if (!navbar) return;
  if (st > 150) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled', 'sleep');
  }
  if (st > 350) {
    navbar.classList.add('awake');
    document.querySelectorAll('.js-scroll-wrap').forEach(function(el) {
      el.classList.add('sleep');
    });
  } else {
    if (navbar.classList.contains('awake')) {
      navbar.classList.remove('awake');
      navbar.classList.add('sleep');
    }
    document.querySelectorAll('.js-scroll-wrap').forEach(function(el) {
      el.classList.remove('sleep');
    });
  }
});

// ─── Smooth one-page navigation ───────────────────────────────────────────
document.querySelectorAll('#ftco-nav a[href^="#"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    var target = document.querySelector(link.getAttribute('href'));
    if (target) {
      var offset = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

// ─── Intersection Observer for .ftco-animate (replaces Waypoints) ─────────
(function() {
  var animItems = document.querySelectorAll('.ftco-animate');
  if (!animItems.length) return;

  var observer = new IntersectionObserver(function(entries) {
    var stagger = 0;
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !entry.target.classList.contains('ftco-animated')) {
        var el = entry.target;
        var effect = el.dataset.animateEffect || 'fadeInUp';
        var delay = stagger * 50;
        stagger++;
        setTimeout(function() {
          el.classList.add(effect, 'ftco-animated');
          el.style.visibility = 'visible';
          el.style.opacity = '1';
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.05 });

  animItems.forEach(function(el) { observer.observe(el); });
})();

// ─── Dropdown hover (desktop) ─────────────────────────────────────────────
document.querySelectorAll('nav .dropdown').forEach(function(dropdown) {
  dropdown.addEventListener('mouseenter', function() {
    this.classList.add('show');
    var a = this.querySelector(':scope > a');
    if (a) a.setAttribute('aria-expanded', 'true');
    var menu = this.querySelector('.dropdown-menu');
    if (menu) menu.classList.add('show');
  });
  dropdown.addEventListener('mouseleave', function() {
    this.classList.remove('show');
    var a = this.querySelector(':scope > a');
    if (a) a.setAttribute('aria-expanded', 'false');
    var menu = this.querySelector('.dropdown-menu');
    if (menu) menu.classList.remove('show');
  });
});
