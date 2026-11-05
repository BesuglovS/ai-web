import { qsa } from './utils.js';

/**
 * Оборачивает таблицы контента в .table-wrapper, чтобы на узких экранах
 * они прокручивались горизонтально, а не растягивали всю страницу.
 */
export function initTableWrappers() {
  qsa('.page-content table').forEach((table) => {
    const parent = table.parentElement;
    if (parent && parent.classList.contains('table-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
}
