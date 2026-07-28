import { LESSON_META, SECTION_META } from '../config/courseData.js';
import { qs, createEl, escapeHtml } from './utils.js';

const COMPLEXITY_COLORS = {
  'beginner': 'green',
  'basic': 'blue',
  'intermediate': 'orange',
  'advanced': 'red'
};

export function renderLessonMeta() {
  const container = qs('.lesson-meta');
  if (!container) return;

  const el = qs('[data-lesson-number]');
  if (!el) return;

  const num = parseInt(el.dataset.lessonNumber, 10);
  const lesson = LESSON_META.find(l => l.number === num);
  if (!lesson) return;

  const section = SECTION_META.find(s => s.id === lesson.section);
  const complexityColor = COMPLEXITY_COLORS[lesson.complexity] || 'gray';

  container.innerHTML = '';

  const metaBar = createEl('div', { className: 'lesson-meta-bar' });

  const numberBadge = createEl('span', {
    className: 'lesson-meta-number',
    textContent: `Урок ${lesson.number}`
  });
  metaBar.appendChild(numberBadge);

  if (section) {
    const sectionLink = createEl('a', {
      className: 'lesson-meta-section',
      href: `/sections/${section.id}/`,
      textContent: section.title
    });
    metaBar.appendChild(sectionLink);
  }

  const separator1 = createEl('span', { className: 'meta-separator', textContent: '·' });
  metaBar.appendChild(separator1);

  const durationEl = createEl('span', {
    className: 'lesson-meta-duration',
    innerHTML: `⏱ ${escapeHtml(lesson.duration)}`
  });
  metaBar.appendChild(durationEl);

  const separator2 = createEl('span', { className: 'meta-separator', textContent: '·' });
  metaBar.appendChild(separator2);

  const complexityEl = createEl('span', {
    className: `lesson-meta-complexity complexity-${complexityColor}`,
    textContent: lesson.complexity
  });
  metaBar.appendChild(complexityEl);

  container.appendChild(metaBar);
}

export function renderIndexMeta(lessonNumber, targetEl) {
  const lesson = LESSON_META.find(l => l.number === lessonNumber);
  if (!lesson || !targetEl) return;

  const meta = createEl('div', { className: 'card-meta' });
  const section = SECTION_META.find(s => s.id === lesson.section);
  const complexityColor = COMPLEXITY_COLORS[lesson.complexity] || 'gray';

  meta.innerHTML = `
    <span class="card-meta-duration">${escapeHtml(lesson.duration)}</span>
    <span class="card-meta-complexity complexity-${complexityColor}">${escapeHtml(lesson.complexity)}</span>
    ${section ? `<span class="card-meta-section">${escapeHtml(section.title)}</span>` : ''}
  `;

  targetEl.appendChild(meta);
}

export function initLessonMeta() {
  renderLessonMeta();
}
