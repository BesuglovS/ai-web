import { qs, on, throttle } from './utils.js';
import { SCROLL_THROTTLE_MS } from '../config/constants.js';
import { storageGet, storageSet } from './utils.js';

const SCROLL_KEY = 'scroll-positions';

function getPageKey() {
  return window.location.pathname;
}

function getSavedScroll() {
  const all = storageGet(SCROLL_KEY) || {};
  return all[getPageKey()] || 0;
}

function saveScrollPosition() {
  const all = storageGet(SCROLL_KEY) || {};
  all[getPageKey()] = window.scrollY;
  storageSet(SCROLL_KEY, all);
}

const throttledSave = throttle(saveScrollPosition, SCROLL_THROTTLE_MS);

function restoreScrollPosition() {
  const saved = getSavedScroll();
  if (saved > 0) {
    requestAnimationFrame(() => {
      window.scrollTo(0, saved);
    });
  }
}

function cleanupOldEntries() {
  const all = storageGet(SCROLL_KEY) || {};
  const entries = Object.keys(all);
  if (entries.length > 100) {
    const sorted = entries.sort((a, b) => (all[a] || 0) - (all[b] || 0));
    const toRemove = sorted.slice(0, entries.length - 50);
    toRemove.forEach(key => delete all[key]);
    storageSet(SCROLL_KEY, all);
  }
}

function initScrollRestore() {
  on(window, 'scroll', throttledSave, { passive: true });
  on(window, 'beforeunload', saveScrollPosition);

  restoreScrollPosition();
  cleanupOldEntries();
}

export { initScrollRestore, saveScrollPosition, restoreScrollPosition };
