import { LESSON_META, SECTION_META } from '../config/courseData.js';
import { storageGet } from './utils.js';

export function initHamburgerMenu() {
  const pagePath = window.location.pathname;

  const btn = document.createElement('button');
  btn.className = 'hamburger-menu';
  btn.textContent = '\u2630';
  btn.setAttribute('aria-label', 'Меню уроков');
  btn.setAttribute('aria-expanded', 'false');
  btn.title = 'Список уроков';
  document.body.appendChild(btn);

  const overlay = document.createElement('div');
  overlay.className = 'hamburger-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  const panel = document.createElement('div');
  panel.className = 'hamburger-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Навигация по урокам');
  panel.setAttribute('aria-modal', 'true');
  panel.id = 'hamburger-panel';
  btn.setAttribute('aria-controls', 'hamburger-panel');

  const header = document.createElement('div');
  header.className = 'hamburger-header';
  header.textContent = '\ud83e\udd16 Уроки AI ';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'hamburger-close';
  closeBtn.textContent = '\u2715';
  closeBtn.setAttribute('aria-label', 'Закрыть меню');
  header.appendChild(closeBtn);
  panel.appendChild(header);

  const list = document.createElement('ul');
  list.className = 'hamburger-list';
  list.setAttribute('role', 'list');
  panel.appendChild(list);

  document.body.appendChild(panel);

  function openPanel() {
    panel.classList.add('open');
    overlay.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
  }

  function closePanel() {
    panel.classList.remove('open');
    overlay.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    btn.focus();
  }

  btn.addEventListener('click', function () {
    if (panel.classList.contains('open')) {
      closePanel();
    } else {
      openPanel();
    }
  });

  overlay.addEventListener('click', closePanel);
  closeBtn.addEventListener('click', closePanel);

  panel.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closePanel();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = panel.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      closePanel();
    }
  });

  const progress = storageGet('progress') || { completedLessons: [] };
  const completed = progress.completedLessons || [];

  LESSON_META.forEach(function (lesson) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '/' + lesson.slug + '/';
    a.className = 'hamburger-link';

    const numSpan = document.createElement('span');
    numSpan.className = 'hamburger-num';
    numSpan.textContent = String(lesson.number);
    a.appendChild(numSpan);
    a.appendChild(document.createTextNode(' ' + lesson.title));

    if (completed.includes(lesson.number)) {
      const checkSpan = document.createElement('span');
      checkSpan.className = 'hamburger-check';
      checkSpan.textContent = '\u2713';
      a.appendChild(checkSpan);
      a.classList.add('completed-link');
      a.setAttribute('aria-current', 'false');
    }

    if (pagePath === '/' + lesson.slug + '/' || pagePath === '/' + lesson.slug) {
      a.classList.add('hamburger-active');
      a.setAttribute('aria-current', 'page');
    }

    li.appendChild(a);
    list.appendChild(li);
  });
}
