import { QUIZ_MIN_SCORE } from '../config/constants.js';
import { qs, qsa, on, createEl, escapeHtml } from './utils.js';
import { saveQuizScore } from './progress.js';

let quizData = null;
let currentQuestion = 0;
let userAnswers = [];
let lessonNumber = 0;

export async function loadQuiz(lessonNum) {
  lessonNumber = lessonNum;
  try {
    const response = await fetch(`/data/quizzes/quiz-${lessonNum}.json`);
    if (!response.ok) throw new Error('Тест не найден');
    quizData = await response.json();
    currentQuestion = 0;
    userAnswers = [];
    renderQuiz();
  } catch (err) {
    console.warn('[quiz] Ошибка загрузки теста:', err.message);
    renderQuizNotFound();
  }
}

function renderQuizNotFound() {
  const container = qs('.quiz-container');
  if (!container) return;
  container.innerHTML = '<p class="quiz-empty">Тест для этого урока пока недоступен.</p>';
}

function renderQuiz() {
  const container = qs('.quiz-container');
  if (!container || !quizData) return;
  container.innerHTML = '';

  const progress = createEl('div', { className: 'quiz-progress' });
  const progressBar = createEl('div', { className: 'quiz-progress-bar' });
  const progressFill = createEl('div', {
    className: 'quiz-progress-fill',
    style: `width: ${((currentQuestion + 1) / quizData.questions.length) * 100}%`
  });
  progressBar.appendChild(progressFill);
  const progressText = createEl('div', {
    className: 'quiz-progress-text',
    textContent: `Вопрос ${currentQuestion + 1} из ${quizData.questions.length}`
  });
  progress.appendChild(progressBar);
  progress.appendChild(progressText);
  container.appendChild(progress);

  const q = quizData.questions[currentQuestion];
  const questionEl = createEl('div', { className: 'quiz-question' });
  const questionText = createEl('h3', {
    className: 'quiz-question-text',
    textContent: q.question
  });
  questionEl.appendChild(questionText);

  if (q.code) {
    const codeBlock = createEl('pre', {
      className: 'quiz-code',
      innerHTML: `<code>${escapeHtml(q.code)}</code>`
    });
    questionEl.appendChild(codeBlock);
  }

  const optionsEl = createEl('div', { className: 'quiz-options' });
  q.options.forEach((option, idx) => {
    const btn = createEl('button', {
      className: 'quiz-option-btn',
      textContent: option,
      'data-index': idx
    });
    on(btn, 'click', () => selectAnswer(idx));
    optionsEl.appendChild(btn);
  });

  questionEl.appendChild(optionsEl);
  container.appendChild(questionEl);
}

function selectAnswer(idx) {
  userAnswers[currentQuestion] = idx;

  const buttons = qsa('.quiz-option-btn');
  buttons.forEach((btn, i) => {
    btn.classList.toggle('selected', i === idx);
  });

  setTimeout(() => {
    if (currentQuestion < quizData.questions.length - 1) {
      currentQuestion++;
      renderQuiz();
    } else {
      showResults();
    }
  }, 400);
}

function showResults() {
  const container = qs('.quiz-container');
  if (!container) return;
  container.innerHTML = '';

  let correct = 0;
  quizData.questions.forEach((q, i) => {
    if (userAnswers[i] === q.correct) correct++;
  });

  const total = quizData.questions.length;
  const score = Math.round((correct / total) * 100);
  const passed = score >= QUIZ_MIN_SCORE;

  saveQuizScore(lessonNumber, score);

  const resultEl = createEl('div', { className: 'quiz-result' });
  const icon = passed ? '🎉' : '😔';
  const message = passed
    ? 'Тест пройден! Отличный результат!'
    : `Тест не пройден. Нужно набрать ${QUIZ_MIN_SCORE}% или выше.`;

  resultEl.innerHTML = `
    <div class="quiz-result-icon">${icon}</div>
    <div class="quiz-result-score">${score}%</div>
    <div class="quiz-result-detail">${correct} из ${total} правильных ответов</div>
    <div class="quiz-result-message">${message}</div>
  `;

  const explanations = createEl('div', { className: 'quiz-explanations' });
  explanations.innerHTML = '<h3>Разбор ответов</h3>';

  quizData.questions.forEach((q, i) => {
    const isCorrect = userAnswers[i] === q.correct;
    const item = createEl('div', {
      className: `quiz-explanation-item ${isCorrect ? 'correct' : 'incorrect'}`
    });
    item.innerHTML = `
      <div class="quiz-explanation-question">${escapeHtml(q.question)}</div>
      <div class="quiz-explanation-answer">
        Ваш ответ: ${escapeHtml(q.options[userAnswers[i]] || 'нет ответа')}
        ${isCorrect ? '✓' : ` → Правильный: ${escapeHtml(q.options[q.correct])}`}
      </div>
      ${q.explanation ? `<div class="quiz-explanation-text">${escapeHtml(q.explanation)}</div>` : ''}
    `;
    explanations.appendChild(item);
  });

  const retryBtn = createEl('button', {
    className: 'btn btn-primary',
    textContent: 'Пройти ещё раз'
  });
  on(retryBtn, 'click', () => loadQuiz(lessonNumber));

  const backBtn = createEl('button', {
    className: 'btn btn-outline',
    textContent: 'Вернуться к уроку'
  });
  on(backBtn, 'click', () => {
    const el = qs('.quiz-container');
    if (el) el.style.display = 'none';
  });

  const actions = createEl('div', { className: 'quiz-result-actions' });
  actions.appendChild(retryBtn);
  actions.appendChild(backBtn);

  container.appendChild(resultEl);
  container.appendChild(explanations);
  container.appendChild(actions);
}

export function initQuiz() {
  const container = qs('.quiz-container');
  if (!container) return;
  const num = parseInt(document.body.getAttribute('data-lesson-number'), 10);
  if (num) loadQuiz(num);
}
