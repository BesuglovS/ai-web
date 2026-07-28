import { LESSON_META, SECTION_META } from '../config/courseData.js';
import { qs, createEl } from './utils.js';

function detectPageType() {
  const body = document.body;
  if (body.classList.contains('page-lesson')) return 'lesson';
  if (body.classList.contains('page-section')) return 'section';
  if (body.classList.contains('page-index')) return 'index';
  if (body.classList.contains('page-badges')) return 'badges';
  return 'other';
}

function getLessonNumber() {
  const el = qs('[data-lesson-number]');
  return el ? parseInt(el.dataset.lessonNumber, 10) : null;
}

function getSectionId() {
  const el = qs('[data-section]');
  return el ? el.dataset.section : null;
}

function createBreadcrumbItem(text, href, isLast) {
  const li = createEl('li', { className: 'breadcrumb-item' });
  if (isLast) {
    li.setAttribute('aria-current', 'page');
    const span = createEl('span', { textContent: text });
    span.className = 'breadcrumb-current';
    li.appendChild(span);
  } else {
    const a = createEl('a', { href, textContent: text });
    li.appendChild(a);
  }
  return li;
}

export function renderBreadcrumbs() {
  const container = qs('.breadcrumb-nav');
  if (!container) return;

  const pageType = detectPageType();
  container.innerHTML = '';

  const homeLink = createEl('a', { href: '/', textContent: 'Главная' });
  container.appendChild(homeLink);

  if (pageType === 'lesson') {
    const num = getLessonNumber();
    if (num) {
      const lesson = LESSON_META.find(l => l.number === num);
      if (lesson) {
        const section = SECTION_META.find(s => s.id === lesson.section);
        if (section) {
          const sep = createEl('span', { className: 'breadcrumb-nav__separator', textContent: '\u203A' });
          const sectionLink = createEl('a', { href: `/${lesson.slug}/`, textContent: section.title });
          container.appendChild(sep);
          container.appendChild(sectionLink);
        }
        const sep2 = createEl('span', { className: 'breadcrumb-nav__separator', textContent: '\u203A' });
        const current = createEl('span', { className: 'breadcrumb-nav__current', textContent: lesson.title });
        container.appendChild(sep2);
        container.appendChild(current);
      }
    }
  } else if (pageType === 'section') {
    const sectionId = getSectionId();
    if (sectionId) {
      const section = SECTION_META.find(s => s.id === sectionId);
      if (section) {
        const sep = createEl('span', { className: 'breadcrumb-nav__separator', textContent: '\u203A' });
        const current = createEl('span', { className: 'breadcrumb-nav__current', textContent: section.title });
        container.appendChild(sep);
        container.appendChild(current);
      }
    }
  } else if (pageType === 'badges') {
    const sep = createEl('span', { className: 'breadcrumb-nav__separator', textContent: '\u203A' });
    const current = createEl('span', { className: 'breadcrumb-nav__current', textContent: 'Достижения' });
    container.appendChild(sep);
    container.appendChild(current);
  }
}

export function initBreadcrumbs() {
  renderBreadcrumbs();
}
