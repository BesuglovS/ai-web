import { qsa, on } from './utils.js';

const KEYWORDS = {
  python: /\b(def|class|import|from|return|if|elif|else|for|while|try|except|finally|with|as|yield|lambda|pass|break|continue|True|False|None|and|or|not|in|is|print|self|raise|async|await|global|nonlocal)\b/g,
  javascript: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|this|class|extends|import|export|default|from|try|catch|finally|throw|async|await|yield|null|undefined|true|false|typeof|instanceof)\b/g,
  json: /("[\w\-]+")\s*:/g,
  bash: /\b(echo|cd|ls|mkdir|rm|cp|mv|cat|grep|pip|python|npm|node|git|sudo|curl|wget)\b/g,
  sql: /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|TABLE|DROP|JOIN|ON|AND|OR|NOT|NULL|INNER|LEFT|RIGHT|GROUP|BY|ORDER|ASC|DESC|LIMIT|HAVING|AS)\b/gi
};

const STRING_PATTERNS = [
  { regex: /("""[\s\S]*?"""|'''[\s\S]*?''')/g, className: 'hl-string' },
  { regex: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, className: 'hl-string' },
  { regex: /(#[^\n]*)/g, className: 'hl-comment' },
  { regex: /(\/\/[^\n]*)/g, className: 'hl-comment' },
  { regex: /\b(\d+\.?\d*)\b/g, className: 'hl-number' }
];

function detectLanguage(codeEl) {
  const classStr = codeEl.className || '';
  const match = classStr.match(/language-(\w+)|lang-(\w+)/);
  if (match) return match[1] || match[2];

  const parent = codeEl.parentElement;
  if (parent) {
    const parentClass = parent.className || '';
    const parentMatch = parentClass.match(/language-(\w+)|lang-(\w+)/);
    if (parentMatch) return parentMatch[1] || parentMatch[2];
  }
  return null;
}

function highlightCode(code, language) {
  let escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const keywordRegex = KEYWORDS[language];
  if (keywordRegex) {
    escaped = escaped.replace(keywordRegex, '<span class="hl-keyword">$1</span>');
  }

  STRING_PATTERNS.forEach(({ regex, className }) => {
    escaped = escaped.replace(regex, (match) => {
      if (match.includes('hl-')) return match;
      return `<span class="${className}">${match}</span>`;
    });
  });

  escaped = escaped.replace(/\b(\w+)\s*\(/g, '<span class="hl-function">$1</span>(');

  return escaped;
}

function processCodeBlock(pre) {
  const codeEl = pre.querySelector('code');
  if (!codeEl) return;
  if (pre.dataset.highlighted) return;

  const language = detectLanguage(codeEl) || detectLanguage(pre);
  const rawText = codeEl.textContent;

  if (language) {
    codeEl.innerHTML = highlightCode(rawText, language);
    codeEl.classList.add(`language-${language}`);
  } else {
    codeEl.innerHTML = highlightCode(rawText, 'plaintext');
  }

  pre.dataset.highlighted = 'true';
  pre.classList.add('highlighted');
}

function highlightAllCodeBlocks() {
  const blocks = qsa('pre code, pre');
  blocks.forEach(block => {
    const pre = block.tagName === 'PRE' ? block : block.parentElement;
    if (pre) processCodeBlock(pre);
  });
}

function initSyntaxHighlight() {
  highlightAllCodeBlocks();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          const pres = node.tagName === 'PRE'
            ? [node]
            : qsa('pre', node);
          pres.forEach(pre => processCodeBlock(pre));
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

export { initSyntaxHighlight, highlightCode, detectLanguage };
