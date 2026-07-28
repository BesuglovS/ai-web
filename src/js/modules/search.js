import { LESSON_META, SECTION_META } from '../config/courseData.js';
import { SEARCH_DEBOUNCE_MS } from '../config/constants.js';
import { qs, qsa, on, debounce, escapeHtml } from './utils.js';

let searchInput = null;
let lessonCards = [];
let allLessons = [];

function normalizeText(str) {
  return str.toLowerCase().trim();
}

function matchesQuery(lesson, query) {
  if (!query) return true;
  const q = normalizeText(query);
  const haystack = [
    lesson.title,
    lesson.description,
    lesson.slug,
    lesson.section,
    lesson.complexity || ''
  ].map(normalizeText).join(' ');
  return q.split(/\s+/).every(word => haystack.includes(word));
}

function filterAndRender(query) {
  const normalizedQuery = normalizeText(query);

  lessonCards.forEach(card => {
    const num = parseInt(card.dataset.lesson, 10);
    const lesson = allLessons.find(l => l.number === num);
    if (!lesson) return;

    const match = matchesQuery(lesson, normalizedQuery);
    card.style.display = match ? '' : 'none';

    if (normalizedQuery && match) {
      card.classList.add('search-highlight');
    } else {
      card.classList.remove('search-highlight');
    }
  });

  const visibleCount = lessonCards.filter(c => c.style.display !== 'none').length;
  const counter = qs('.search-counter');
  if (counter) {
    if (normalizedQuery) {
      counter.textContent = `Найдено: ${visibleCount}`;
      counter.style.display = '';
    } else {
      counter.style.display = 'none';
    }
  }

  qsa('.section-group').forEach(group => {
    const visibleCards = qsa('.topic-card', group).filter(c => c.style.display !== 'none');
    group.style.display = visibleCards.length > 0 ? '' : 'none';
  });

  const noResults = qs('.search-no-results');
  if (noResults) {
    noResults.style.display = visibleCount === 0 && normalizedQuery ? '' : 'none';
  }
}

const debouncedFilter = debounce((query) => filterAndRender(query), SEARCH_DEBOUNCE_MS);

function initSearch() {
  searchInput = qs('.search-input');
  if (!searchInput) return;

  allLessons = LESSON_META;
  lessonCards = qsa('.topic-card');

  on(searchInput, 'input', (e) => {
    debouncedFilter(e.target.value);
  });

  on(searchInput, 'keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      filterAndRender('');
      searchInput.blur();
    }
  });

  const clearBtn = qs('.search-clear');
  if (clearBtn) {
    on(clearBtn, 'click', () => {
      searchInput.value = '';
      filterAndRender('');
      searchInput.focus();
    });
  }
}

export { initSearch, filterAndRender, matchesQuery };
