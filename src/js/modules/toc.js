import { qs, qsa, on, throttle, createEl } from './utils.js';
import { SCROLL_THROTTLE_MS } from '../config/constants.js';

let tocLinks = [];
let headings = [];
let activeId = null;

function extractHeadings() {
  const content = qs('.page-content, .main-content, article');
  if (!content) return [];

  return qsa('h2, h3, h4', content).map((heading, index) => {
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }
    return {
      id: heading.id,
      text: heading.textContent.trim(),
      level: parseInt(heading.tagName.charAt(1), 10),
      el: heading
    };
  });
}

function renderToc(headingsList) {
  const container = qs('.toc-sidebar');
  if (!container || headingsList.length === 0) {
    if (container) container.style.display = 'none';
    return;
  }

  const nav = createEl('nav', { className: 'toc-nav', 'aria-label': 'Содержание' });
  const title = createEl('div', { className: 'toc-title', textContent: 'Содержание' });
  const list = createEl('ol', { className: 'toc-list' });

  headingsList.forEach(h => {
    const li = createEl('li', {
      className: `toc-item toc-level-${h.level}`
    });
    const a = createEl('a', {
      className: 'toc-link',
      href: `#${h.id}`,
      textContent: h.text
    });
    a.dataset.targetId = h.id;
    on(a, 'click', (e) => {
      e.preventDefault();
      const target = document.getElementById(h.id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', `#${h.id}`);
      }
    });
    li.appendChild(a);
    list.appendChild(li);
  });

  nav.appendChild(title);
  nav.appendChild(list);
  container.innerHTML = '';
  container.appendChild(nav);
  container.style.display = '';

  tocLinks = qsa('.toc-link', container);
}

function updateActiveHeading() {
  const scrollPos = window.scrollY + 120;
  let currentId = null;

  for (let i = headings.length - 1; i >= 0; i--) {
    if (headings[i].el.offsetTop <= scrollPos) {
      currentId = headings[i].id;
      break;
    }
  }

  if (currentId !== activeId) {
    activeId = currentId;
    tocLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.targetId === currentId);
    });
  }
}

const throttledUpdate = throttle(updateActiveHeading, SCROLL_THROTTLE_MS);

function initToc() {
  headings = extractHeadings();
  renderToc(headings);

  if (headings.length > 0) {
    on(window, 'scroll', throttledUpdate, { passive: true });
    updateActiveHeading();
  }

  const tocToggle = qs('.toc-toggle');
  if (tocToggle) {
    on(tocToggle, 'click', () => {
      const container = qs('.toc-sidebar');
      if (container) {
        container.classList.toggle('collapsed');
        const isCollapsed = container.classList.contains('collapsed');
        tocToggle.setAttribute('aria-expanded', !isCollapsed);
        tocToggle.textContent = isCollapsed ? '▸ Содержание' : '▾ Содержание';
      }
    });
  }
}

export { initToc, extractHeadings, renderToc };
