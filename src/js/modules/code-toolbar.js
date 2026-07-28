import { qs, qsa, on, createEl } from './utils.js';

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      textarea.remove();
    }
  }
}

function showCopyFeedback(btn) {
  const originalText = btn.textContent;
  btn.textContent = '✓';
  btn.classList.add('copied');
  setTimeout(() => {
    btn.textContent = originalText;
    btn.classList.remove('copied');
  }, 2000);
}

function addCopyButton(pre) {
  if (pre.querySelector('.code-copy-btn')) return;

  pre.style.position = 'relative';

  const btn = createEl('button', {
    className: 'code-copy-btn',
    textContent: 'Копировать',
    'aria-label': 'Копировать код'
  });

  on(btn, 'click', async () => {
    const codeEl = pre.querySelector('code');
    const text = codeEl ? codeEl.textContent : pre.textContent;
    const success = await copyToClipboard(text);
    if (success) {
      showCopyFeedback(btn);
    } else {
      btn.textContent = 'Ошибка';
      setTimeout(() => { btn.textContent = 'Копировать'; }, 2000);
    }
  });

  pre.appendChild(btn);
}

function addLanguageLabel(pre) {
  if (pre.querySelector('.code-lang-label')) return;

  const codeEl = pre.querySelector('code');
  const classStr = (codeEl ? codeEl.className : pre.className) || '';
  const match = classStr.match(/language-(\w+)|lang-(\w+)/);

  if (match) {
    const lang = match[1] || match[2];
    const label = createEl('span', {
      className: 'code-lang-label',
      textContent: lang
    });
    pre.appendChild(label);
  }
}

function processCodeBlock(pre) {
  if (pre.dataset.toolbarAdded) return;
  pre.dataset.toolbarAdded = 'true';
  addCopyButton(pre);
  addLanguageLabel(pre);
}

function initCodeToolbar() {
  qsa('pre').forEach(processCodeBlock);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (node.tagName === 'PRE') {
            processCodeBlock(node);
          } else {
            qsa('pre', node).forEach(processCodeBlock);
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

export { initCodeToolbar, copyToClipboard };
