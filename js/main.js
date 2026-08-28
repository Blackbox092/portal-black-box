/* ============================================================
   BLACK BOX REFRIGERAÇÃO — interações
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Topbar scroll state ---------- */
  var topbar = document.getElementById('topbar');
  function onScroll() {
    if (topbar) {
      topbar.classList.toggle('topbar--scrolled', window.scrollY > 40);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Sticky CTA ---------- */
  var stickyCta = document.getElementById('sticky-cta');
  var offer = document.getElementById('oferta');
  function toggleSticky() {
    if (!stickyCta || !offer) return;
    var rect = offer.getBoundingClientRect();
    var passedOffer = rect.top < window.innerHeight;
    var pastOffer = rect.bottom > 0;
    var visible = passedOffer && !pastOffer;
    stickyCta.classList.toggle('sticky-cta--show', visible);
  }
  window.addEventListener('scroll', toggleSticky, { passive: true });
  window.addEventListener('resize', toggleSticky);
  toggleSticky();

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('reveal--visible'); });
  }

  /* ---------- Módulos: toggle independente, todos visíveis ---------- */
  var modules = document.querySelectorAll('details.module');
  modules.forEach(function (mod) {
    mod.open = true;
  });

  /* ---------- Countdown da oferta (24h rolantes) ---------- */
  var TIMER_MS = 24 * 60 * 60 * 1000;
  var STORAGE_KEY = 'bbroffer_end';
  var endTime = null;

  try {
    var stored = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    if (stored && stored > Date.now()) {
      endTime = stored;
    }
  } catch (e) { /* armazenamento indisponível */ }

  if (!endTime) {
    endTime = Date.now() + TIMER_MS;
    try { localStorage.setItem(STORAGE_KEY, String(endTime)); } catch (e) { /* noop */ }
  }

  var elHours = document.getElementById('t-hours');
  var elMin = document.getElementById('t-min');
  var elSec = document.getElementById('t-sec');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    var diff = endTime - Date.now();
    if (diff <= 0) {
      endTime = Date.now() + TIMER_MS;
      try { localStorage.setItem(STORAGE_KEY, String(endTime)); } catch (e) { /* noop */ }
      diff = TIMER_MS;
    }
    var hours = Math.floor(diff / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    var secs = Math.floor((diff % 60000) / 1000);
    if (elHours) elHours.textContent = pad(hours);
    if (elMin) elMin.textContent = pad(mins);
    if (elSec) elSec.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);

  /* ---------- Ano no rodapé ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
