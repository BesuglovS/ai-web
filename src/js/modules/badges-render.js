import { BADGES } from '../config/badges.js';
import { qs, qsa, on, createEl, escapeHtml } from './utils.js';
import { getProgressData } from './progress.js';
import { storageGet, storageSet } from './utils.js';

const UNLOCKED_KEY = 'unlocked-badges';

function getUnlockedBadges() {
  return storageGet(UNLOCKED_KEY) || [];
}

function saveUnlockedBadges(list) {
  storageSet(UNLOCKED_KEY, list);
}

export function checkBadges() {
  const progress = getProgressData();
  const unlocked = getUnlockedBadges();
  const newUnlocks = [];

  BADGES.forEach(badge => {
    if (!unlocked.includes(badge.id) && badge.condition(progress)) {
      unlocked.push(badge.id);
      newUnlocks.push(badge);
    }
  });

  if (newUnlocks.length > 0) {
    saveUnlockedBadges(unlocked);
    newUnlocks.forEach(badge => showBadgeNotification(badge));
  }

  return newUnlocks;
}

function showBadgeNotification(badge) {
  const notification = createEl('div', { className: 'badge-notification' });
  notification.innerHTML = `
    <div class="badge-notification-icon">${badge.icon}</div>
    <div class="badge-notification-text">
      <div class="badge-notification-title">Достижение получено!</div>
      <div class="badge-notification-name">${escapeHtml(badge.title)}</div>
    </div>
  `;
  document.body.appendChild(notification);

  requestAnimationFrame(() => notification.classList.add('show'));

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 400);
  }, 4000);
}

export function renderBadgesPage() {
  const container = qs('.badges-grid');
  if (!container) return;

  const unlocked = getUnlockedBadges();
  container.innerHTML = '';

  BADGES.forEach(badge => {
    const isUnlocked = unlocked.includes(badge.id);
    const card = createEl('div', {
      className: `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`
    });
    card.innerHTML = `
      <div class="badge-icon">${isUnlocked ? badge.icon : '🔒'}</div>
      <div class="badge-title">${escapeHtml(badge.title)}</div>
      <div class="badge-description">${escapeHtml(badge.description)}</div>
      <div class="badge-status">${isUnlocked ? 'Получено' : 'Не получено'}</div>
    `;
    container.appendChild(card);
  });
}

export function renderBadgesInline(lessonNumber) {
  const container = qs('.lesson-badges');
  if (!container) return;

  const unlocked = getUnlockedBadges();
  const relevant = BADGES.filter(b => {
    try {
      return b.condition({ completedLessons: [lessonNumber], completionDates: [], quizScores: {}, streak: 0, lastStudyDate: null, sessionLessons: 0, finalTestScore: 0 });
    } catch {
      return false;
    }
  });

  if (relevant.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.innerHTML = '<h3 class="section-title">Достижения за этот урок</h3>';
  const grid = createEl('div', { className: 'badges-inline-grid' });

  relevant.forEach(badge => {
    const isUnlocked = unlocked.includes(badge.id);
    const el = createEl('div', {
      className: `badge-inline ${isUnlocked ? 'unlocked' : 'locked'}`
    });
    el.innerHTML = `
      <span class="badge-inline-icon">${isUnlocked ? badge.icon : '🔒'}</span>
      <span class="badge-inline-title">${escapeHtml(badge.title)}</span>
    `;
    grid.appendChild(el);
  });

  container.appendChild(grid);
}

export function openBadgesModal() {
  let modal = qs('.badges-modal');
  if (!modal) {
    modal = createEl('div', { className: 'badges-modal', role: 'dialog', 'aria-modal': 'true' });
    const overlay = createEl('div', { className: 'badges-modal-overlay' });
    const dialog = createEl('div', { className: 'badges-modal-dialog' });
    const header = createEl('div', { className: 'badges-modal-header' });
    const title = createEl('h2', { textContent: 'Мои достижения' });
    const closeBtn = createEl('button', {
      className: 'badges-modal-close',
      textContent: '✕',
      'aria-label': 'Закрыть'
    });
    const body = createEl('div', { className: 'badges-modal-body' });
    const grid = createEl('div', { className: 'badges-grid' });

    header.appendChild(title);
    header.appendChild(closeBtn);
    body.appendChild(grid);
    dialog.appendChild(header);
    dialog.appendChild(body);
    modal.appendChild(overlay);
    modal.appendChild(dialog);
    document.body.appendChild(modal);

    on(closeBtn, 'click', closeBadgesModal);
    on(overlay, 'click', closeBadgesModal);
    on(document, 'keydown', (e) => {
      if (e.key === 'Escape') closeBadgesModal();
    });
  }

  const grid = modal.querySelector('.badges-grid');
  if (grid) {
    const unlocked = getUnlockedBadges();
    grid.innerHTML = '';
    BADGES.forEach(badge => {
      const isUnlocked = unlocked.includes(badge.id);
      const card = createEl('div', {
        className: `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`
      });
      card.innerHTML = `
        <div class="badge-icon">${isUnlocked ? badge.icon : '🔒'}</div>
        <div class="badge-title">${escapeHtml(badge.title)}</div>
        <div class="badge-description">${escapeHtml(badge.description)}</div>
      `;
      grid.appendChild(card);
    });
  }

  modal.classList.add('active');
}

function closeBadgesModal() {
  const modal = qs('.badges-modal');
  if (modal) modal.classList.remove('active');
}

export function initBadges() {
  checkBadges();
  const badgeBtn = qs('.badges-open-btn');
  if (badgeBtn) on(badgeBtn, 'click', openBadgesModal);
}
