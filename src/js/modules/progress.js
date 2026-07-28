import { STORAGE_PREFIX, PROGRESS_DEBOUNCE_MS } from '../config/constants.js';
import { qs, qsa, on, debounce, storageGet, storageSet } from './utils.js';
import { sendProgress, fetchProgress } from './api-client.js';

const PROGRESS_KEY = 'progress';

function getLocalProgress() {
  return storageGet(PROGRESS_KEY) || {
    completedLessons: [],
    completionDates: [],
    quizScores: {},
    sessionLessons: 0,
    streak: 0,
    lastStudyDate: null,
    finalTestScore: 0
  };
}

function saveLocalProgress(progress) {
  storageSet(PROGRESS_KEY, progress);
}

async function syncWithServer() {
  try {
    const serverData = await fetchProgress();
    if (serverData && serverData.completedLessons) {
      const local = getLocalProgress();
      const merged = [...new Set([...local.completedLessons, ...serverData.completedLessons])];
      local.completedLessons = merged;
      saveLocalProgress(local);
    }
  } catch (err) {
    console.warn('[progress] Ошибка синхронизации с сервером:', err.message);
  }
}

const debouncedSync = debounce(syncWithServer, PROGRESS_DEBOUNCE_MS);

export async function markLessonCompleted(lessonNumber) {
  const progress = getLocalProgress();
  if (progress.completedLessons.includes(lessonNumber)) return false;

  progress.completedLessons.push(lessonNumber);
  const today = new Date().toISOString().slice(0, 10);
  progress.completionDates.push(today);

  if (progress.lastStudyDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (progress.lastStudyDate === yesterday) {
      progress.streak = (progress.streak || 0) + 1;
    } else {
      progress.streak = 1;
    }
    progress.lastStudyDate = today;
  }

  progress.sessionLessons = (progress.sessionLessons || 0) + 1;
  saveLocalProgress(progress);

  try {
    await sendProgress(lessonNumber, true);
  } catch (err) {
    console.warn('[progress] Ошибка отправки на сервер:', err.message);
  }

  renderProgressIndicators();
  return true;
}

export function isLessonCompleted(lessonNumber) {
  const progress = getLocalProgress();
  return progress.completedLessons.includes(lessonNumber);
}

export function getCompletedCount() {
  return getLocalProgress().completedLessons.length;
}

export function getProgressData() {
  return getLocalProgress();
}

export function saveQuizScore(lessonNumber, score) {
  const progress = getLocalProgress();
  progress.quizScores[lessonNumber] = score;
  saveLocalProgress(progress);
}

export function getQuizScore(lessonNumber) {
  const progress = getLocalProgress();
  return progress.quizScores[lessonNumber] || null;
}

export function setFinalTestScore(score) {
  const progress = getLocalProgress();
  progress.finalTestScore = score;
  saveLocalProgress(progress);
}

function renderProgressIndicators() {
  const progress = getLocalProgress();
  const total = 50;
  const completed = progress.completedLessons.length;
  const pct = Math.round((completed / total) * 100);

  const barContainer = qs('.progress-bar-container');
  if (barContainer) {
    let barFill = barContainer.querySelector('.progress-bar-fill');
    if (!barFill) {
      barFill = document.createElement('div');
      barFill.className = 'progress-bar-fill';
      barContainer.appendChild(barFill);
      barContainer.style.cssText = 'background:var(--bg-tertiary);border-radius:999px;overflow:hidden;height:8px;';
    }
    barFill.style.width = pct + '%';
    barFill.style.cssText = 'height:100%;background:linear-gradient(90deg,var(--color-primary),var(--color-accent));border-radius:999px;transition:width 0.5s ease;width:' + pct + '%';
    barContainer.setAttribute('aria-valuenow', pct);
  }

  const label = qs('.progress-info');
  if (label) label.textContent = `${completed} из ${total} уроков (${pct}%)`;

  qsa('.topic-card').forEach(card => {
    const num = parseInt(card.dataset.lesson, 10);
    if (num && !isNaN(num) && progress.completedLessons.includes(num)) {
      card.classList.add('completed');
    }
  });
}

function initProgress() {
  renderProgressIndicators();
  syncWithServer();
}

export { initProgress, renderProgressIndicators };
