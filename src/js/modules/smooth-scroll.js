import { qs, qsa, on } from './utils.js';

function smoothScrollTo(target) {
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: 'smooth' });
}

function handleAnchorClick(e) {
  const link = e.target.closest('a[href]');
  if (!link) return;

  const href = link.getAttribute('href');
  if (!href || !href.startsWith('#')) return;

  const targetId = href.slice(1);
  if (!targetId) return;

  const target = document.getElementById(targetId);
  if (!target) return;

  e.preventDefault();
  smoothScrollTo(target);

  history.pushState(null, '', href);
}

function initSmoothScroll() {
  on(document, 'click', handleAnchorClick);

  if (window.location.hash) {
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) {
      setTimeout(() => smoothScrollTo(target), 100);
    }
  }
}

export { initSmoothScroll, smoothScrollTo };
