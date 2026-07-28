import { qs, on } from './utils.js';

function handleKeydown(e) {
  const tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) {
    return;
  }

  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    return;
  }

  if (e.key === 't' || e.key === 'T') {
    e.preventDefault();
    const toggleBtn = qs('.theme-toggle');
    if (toggleBtn) toggleBtn.click();
    return;
  }

  if (e.key === 'm' || e.key === 'M') {
    e.preventDefault();
    const hamburgerBtn = qs('.hamburger-btn');
    if (hamburgerBtn) hamburgerBtn.click();
    return;
  }

  if (e.key === 'Escape') {
    const toc = qs('.toc');
    if (toc && toc.classList.contains('collapsed') === false) {
      toc.classList.add('collapsed');
    }
  }

  if (e.key === '?' || (e.shiftKey && e.key === '/')) {
    e.preventDefault();
    const helpModal = qs('.keyboard-help-modal');
    if (helpModal) {
      helpModal.classList.toggle('active');
    }
  }
}

function renderKeyboardHelp() {
  const helpContent = `
    <div class="keyboard-help-overlay"></div>
    <div class="keyboard-help-dialog">
      <h3>Горячие клавиши</h3>
      <ul>
        <li><kbd>←</kbd> Предыдущий урок</li>
        <li><kbd>→</kbd> Следующий урок</li>
        <li><kbd>T</kbd> Переключить тему</li>
        <li><kbd>M</kbd> Меню</li>
        <li><kbd>?</kbd> Справка</li>
        <li><kbd>Esc</kbd> Закрыть</li>
      </ul>
      <button class="btn btn-outline keyboard-help-close">Закрыть</button>
    </div>
  `;

  let modal = qs('.keyboard-help-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'keyboard-help-modal';
    modal.innerHTML = helpContent;
    document.body.appendChild(modal);

    const overlay = modal.querySelector('.keyboard-help-overlay');
    const closeBtn = modal.querySelector('.keyboard-help-close');

    if (overlay) on(overlay, 'click', () => modal.classList.remove('active'));
    if (closeBtn) on(closeBtn, 'click', () => modal.classList.remove('active'));
  }
}

function initKeyboardNav() {
  on(document, 'keydown', handleKeydown);
  renderKeyboardHelp();
}

export { initKeyboardNav };
