import { initThemeToggle } from './modules/theme.js';
import { initProgress, renderProgressIndicators, markLessonCompleted } from './modules/progress.js';
import { initQuiz } from './modules/quiz.js';
import { initAuth } from './modules/auth.js';
import { initBadges, checkBadges } from './modules/badges-render.js';
import { initSearch } from './modules/search.js';
import { initBreadcrumbs } from './modules/breadcrumbs.js';
import { initToc } from './modules/toc.js';
import { initSectionNav } from './modules/section-nav.js';
import { initHamburgerMenu } from './modules/hamburger-menu.js';
import { initScrollProgress } from './modules/scroll-progress.js';
import { initKeyboardNav } from './modules/keyboard-nav.js';
import { initSmoothScroll } from './modules/smooth-scroll.js';
import { initLessonMeta } from './modules/lesson-meta.js';
import { initScrollRestore } from './modules/scroll-restore.js';
import { initErrorTracking } from './modules/error-tracking.js';
import { initSyntaxHighlight } from './modules/syntax-highlight.js';
import { initCodeToolbar } from './modules/code-toolbar.js';
import { qs, qsa, on } from './modules/utils.js';

function getLessonNumber() {
  const body = document.body;
  if (body.hasAttribute('data-lesson-number')) {
    return parseInt(body.getAttribute('data-lesson-number'), 10);
  }
  const el = qs('[data-lesson-number]');
  return el ? parseInt(el.dataset.lessonNumber, 10) : null;
}

function detectPageType() {
  const body = document.body;
  if (body.classList.contains('page-lesson')) return 'lesson';
  if (body.classList.contains('page-index')) return 'index';
  if (body.classList.contains('page-badges')) return 'badges';
  if (body.classList.contains('page-quiz')) return 'quiz';
  return 'other';
}

function initCompleteLessonButton() {
  const btn = qs('.complete-lesson-btn');
  if (!btn) return;

  const lessonNumber = getLessonNumber();
  if (!lessonNumber) return;

  on(btn, 'click', async () => {
    const success = await markLessonCompleted(lessonNumber);
    if (success) {
      btn.textContent = '\u2713 Урок пройден';
      btn.classList.add('completed');
      btn.disabled = true;
      checkBadges();
    }
  });
}

function initApp() {
  const pageType = detectPageType();

  initErrorTracking();
  initThemeToggle();
  initHamburgerMenu();
  initScrollProgress();
  initKeyboardNav();
  initSmoothScroll();
  initScrollRestore();
  initBreadcrumbs();

  if (pageType === 'index') {
    initProgress();
    initSearch();
  }

  if (pageType === 'lesson') {
    const lessonNumber = getLessonNumber();
    initProgress();
    initLessonMeta();
    initToc();
    initSectionNav();
    initSyntaxHighlight();
    initCodeToolbar();
    initCompleteLessonButton();
    renderProgressIndicators();
    checkBadges();
  }

  initAuth();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
