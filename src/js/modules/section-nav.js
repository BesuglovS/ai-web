import { LESSON_META } from '../config/courseData.js';
import { qs, qsa, on, createEl } from './utils.js';
import { isLessonCompleted } from './progress.js';

function getAdjacentLessons(currentNumber) {
  const idx = LESSON_META.findIndex(l => l.number === currentNumber);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? LESSON_META[idx - 1] : null,
    next: idx < LESSON_META.length - 1 ? LESSON_META[idx + 1] : null
  };
}

function renderNavButtons(currentNumber) {
  const container = qs('.bottom-controls');
  if (!container) return;

  const { prev, next } = getAdjacentLessons(currentNumber);
  container.innerHTML = '';

  if (prev) {
    const prevBtn = createEl('a', {
      className: 'bottom-controls__link bottom-controls__link--prev',
      href: `/${prev.slug}/`,
      'aria-label': `Предыдущий урок: ${prev.title}`
    });
    prevBtn.innerHTML = `
      <span class="bottom-controls__label">← Предыдущий</span>
      <span class="bottom-controls__title">${prev.title}</span>
    `;
    container.appendChild(prevBtn);
  } else {
    const placeholder = createEl('div', { className: 'bottom-controls__link bottom-controls__link--prev disabled' });
    placeholder.innerHTML = '<span class="bottom-controls__label">← Начало курса</span>';
    container.appendChild(placeholder);
  }

  if (next) {
    const nextBtn = createEl('a', {
      className: 'bottom-controls__link bottom-controls__link--next',
      href: `/${next.slug}/`,
      'aria-label': `Следующий урок: ${next.title}`
    });
    nextBtn.innerHTML = `
      <span class="bottom-controls__label">Следующий →</span>
      <span class="bottom-controls__title">${next.title}</span>
    `;
    container.appendChild(nextBtn);
  } else {
    const placeholder = createEl('div', { className: 'bottom-controls__link bottom-controls__link--next disabled' });
    placeholder.innerHTML = '<span class="bottom-controls__label">Курс завершён! →</span>';
    container.appendChild(placeholder);
  }
}

function handleKeyNav(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  const el = qs('[data-lesson-number]');
  if (!el) return;
  const currentNumber = parseInt(el.dataset.lessonNumber, 10);

  if (e.key === 'ArrowLeft') {
    const { prev } = getAdjacentLessons(currentNumber);
    if (prev) window.location.href = `/${prev.slug}/`;
  } else if (e.key === 'ArrowRight') {
    const { next } = getAdjacentLessons(currentNumber);
    if (next) window.location.href = `/${next.slug}/`;
  }
}

function initSectionNav() {
  const el = qs('[data-lesson-number]');
  if (!el) return;
  const currentNumber = parseInt(el.dataset.lessonNumber, 10);
  renderNavButtons(currentNumber);
  on(document, 'keydown', handleKeyNav);
}

export { initSectionNav, getAdjacentLessons };
