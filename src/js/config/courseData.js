export const SECTION_META = [
  { id: 'tools', title: 'Инструменты ИИ', description: 'Установка и настройка ИИ-ассистентов для редактора и терминала' }
];

export const LESSON_META = [
  { number: 1, slug: '01-vscode-cline', title: 'VS Code + Cline: установка и настройка', section: 'tools', description: 'Пошагово: ставим VS Code, расширение Cline, подключаем модель по API-ключу и делаем первый проект с ИИ-агентом.', duration: '25 мин', complexity: 'beginner' },
  { number: 2, slug: '02-nodejs-opencode', title: 'Node.js + opencode: установка и настройка', section: 'tools', description: 'Пошагово: ставим Node.js LTS и opencode, подключаем провайдера моделей и запускаем первого ИИ-агента в терминале.', duration: '25 мин', complexity: 'beginner' }
];

export const TOTAL_LESSONS = LESSON_META.length;

export function getLessonBySlug(slug) {
  return LESSON_META.find(l => l.slug === slug) || null;
}

export function getLessonByNumber(num) {
  return LESSON_META.find(l => l.number === num) || null;
}

export function getLessonsBySection(sectionId) {
  return LESSON_META.filter(l => l.section === sectionId);
}

export function getSectionMeta(sectionId) {
  return SECTION_META.find(s => s.id === sectionId) || null;
}

export function getNextLesson(currentNumber) {
  return LESSON_META.find(l => l.number === currentNumber + 1) || null;
}

export function getPrevLesson(currentNumber) {
  return LESSON_META.find(l => l.number === currentNumber - 1) || null;
}
