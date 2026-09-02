# Архитектура проекта ai-web

## Обзор

Проект представляет собой **статический сайт** курса по искусственному интеллекту, сгенерированный с помощью **Eleventy**. Серверная логика (аутентификация, прогресс, бейджи) вынесена в отдельные PHP-скрипты.

```
┌─────────────────────────────────────────────────────┐
│                    Build Pipeline                    │
│  build-css.mjs → build-js.mjs → build-highlight.mjs │
│  → build-config-meta.mjs → build-assets-hash.mjs    │
│  → Eleventy (SSG) → build-sw.mjs                     │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│                  _site/ (Output)                      │
│  index.html + 50 lesson .html files                  │
│  css/main.css · js/main.js · js/hljs.min.js          │
│  sandbox/ (PHP passthrough) · sw.js (service worker) │
└─────────────────────────────────────────────────────┘
```

## Конвейер сборки

Сборка выполняется строго последовательно (`npm run build`):

1. **`build-css.mjs`** — сборка CSS через esbuild: `src/css/index.css` (импортирующий 15 partial-файлов) → `_site/css/main.css` (минифицированный)
2. **`build-js.mjs`** — сборка JS через esbuild: `src/js/script.js` (с 20 модулями) → `_site/js/main.js` (ESM, минифицированный)
3. **`build-highlight.mjs`** — сборка кастомного highlight.js (поддерживает Python, JavaScript, JSON, Bash, SQL) → `_site/js/hljs.min.js`
4. **`build-config-meta.mjs`** — чтение `lessons.json` → генерация `src/_data/courseConfig.json` (метаданные для Eleventy)
5. **`build-assets-hash.mjs`** — MD5-хэши `main.css` и `main.js` → `src/_data/assetsHash.json` (cache-busting)
6. **`npx @11ty/eleventy`** — генерация HTML из Markdown + Nunjucks-шаблонов
7. **`build-sw.mjs`** — генерация service worker с precache всех файлов `_site/`

## Компоненты

### Генератор статики (Eleventy)

Конфигурация: `eleventy.config.mjs`

-   Входная директория: `src/`
-   Выходная директория: `_site/`
-   Шаблонизатор: Nunjucks
-   Парсер Markdown: markdown-it с плагином `markdown-it-anchor` (генерация якорей для заголовков)
-   Passthrough copy: `sandbox/` → `_site/sandbox/`

#### Плагины

-   `src/_plugins/norun.mjs` — кастомный markdown-it-плагин для обработки блоков кода (вероятно, управляет поведением кнопки «запуск»)

#### Шаблоны

-   `_includes/layout.njk` — базовый макет страницы урока (хедер, сайдбар TOC, контент, виджеты прогресса, навигация prev/next)
-   `_includes/layout-index.njk` — макет домашней страницы (список уроков по разделам, поиск, прогресс, бейджи)

#### Данные (Eleventy data cascade)

-   `_data/site.json` — метаданные сайта (url, заголовок)
-   `_data/courseConfig.json` — сгенерированные метаданные курса (разделы, уроки)
-   `_data/lessonsData.cjs` — загрузчик `lessons.json` для Eleventy
-   `_data/eleventyComputed.js` — вычисляемые поля (предыдущий/следующий урок, номер раздела)
-   `_data/assetsHash.json` — хэши ассетов для cache-busting

### Клиентская часть

#### CSS (`src/css/`)

16 partial-файлов, импортируемых через `index.css`:

| Файл | Назначение |
|---|---|
| `_variables.css` | CSS-переменные (цвета, шрифты, отступы) |
| `_reset.css` | Сброс стилей |
| `_typography.css` | Типографика |
| `_layout.css` | Базовая раскладка |
| `_components.css` | UI-компоненты |
| `_code.css` | Стили для блоков кода |
| `_tables.css` | Таблицы |
| `_widgets.css` | Виджеты |
| `_interactive.css` | Интерактивные элементы |
| `_navigation.css` | Навигация |
| `_index.css` | Стили домашней страницы |
| `_hamburger.css` | Гамбургер-меню |
| `_auth.css` | Элементы аутентификации |
| `_responsive.css` | Медиа-запросы |
| `_print.css` | Стили для печати |

#### JavaScript (`src/js/`)

Модульная архитектура. Точка входа: `script.js`.

**Конфигурация:**

-   `config/constants.js` — константы (API URL, настройки)
-   `config/courseData.js` — массивы уроков и разделов + хелперы
-   `config/badges.js` — 20 определений значков с условиями разблокировки
-   `config/security.js` — безопасная обёртка localStorage

**Модули (20 штук):**

| Модуль | Ответственность |
|---|---|
| `api-client.js` | HTTP-клиент для PHP-бэкенда |
| `auth.js` | Аутентификация через `auth.nayanovaacademy.ru` |
| `badges-render.js` | Отображение значков достижений |
| `breadcrumbs.js` | Хлебные крошки |
| `code-toolbar.js` | Кнопка копирования на блоках кода |
| `error-tracking.js` | Логирование ошибок |
| `hamburger-menu.js` | Мобильное меню |
| `keyboard-nav.js` | Клавиатурные сокращения |
| `lesson-meta.js` | Метаданные урока (сложность, время) |
| `progress.js` | Отслеживание прогресса |
| `quiz.js` | Механика викторин |
| `scroll-progress.js` | Индикатор прогресса чтения |
| `scroll-restore.js` | Восстановление позиции прокрутки |
| `search.js` | Поиск по урокам |
| `section-nav.js` | Навигация по разделам |
| `smooth-scroll.js` | Плавная прокрутка |
| `syntax-highlight.js` | Подсветка кода (highlight.js) |
| `theme.js` | Переключение тёмной/светлой темы |
| `toc.js` | Генерация бокового оглавления |
| `utils.js` | DOM-утилиты (`qs`, `qsa`, `on`) |

### Серверная часть (PHP)

Директория: `sandbox/`. Копируется в `_site/sandbox/` без обработки.

| Файл | Назначение |
|---|---|
| `Auth.php` | Класс аутентификации |
| `auth_check.php` | Проверка авторизации |
| `config.php` | Конфигурация |
| `Database.php` | Подключение к БД |
| `progress.php` | API сохранения/загрузки прогресса |
| `badges.php` | API значков достижений |
| `run.php` | Песочница для выполнения кода |
| `sandbox_common.php` | Общие утилиты |

### Данные курса

`lessons.json` — центральный источник истины. Содержит 50 уроков, сгруппированных в 9 разделов:

| Раздел | Уроки | Сложность |
|---|---|---|
| intro (введение) | 1-2 | beginner |
| history (история) | 3-7 | beginner-basic |
| math (математика) | 8-15 | intermediate-advanced |
| neural-networks (нейросети) | 16-22 | basic-advanced |
| transformer (трансформеры) | 23-28 | advanced |
| training (обучение) | 29-33 | intermediate |
| llm (языковые модели) | 34-40 | basic-advanced |
| llama (открытые модели и локальный запуск) | 41-45 | intermediate-advanced |
| tools (инструменты) | 46-50 | basic-intermediate |

Каждый урок содержит поля: `section`, `number`, `slug`, `title`, `description`, `complexity`, `duration`.

### Система достижений

20 значков, определённых в `src/js/config/badges.js`. Условия разблокировки:

-   Прохождение определённых диапазонов уроков
-   Общее количество пройденных уроков (25, 50)
-   Серия занятий (7 дней подряд)
-   Скорость (3 урока за день)
-   Результаты викторин (90%+, 100%)

### Маршруты

| URL | Тип | Шаблон | Генерация |
|---|---|---|---|
| `/` | Главная | `layout-index.njk` | `src/index.njk` |
| `/{slug}/` | Урок | `layout.njk` | `src/{slug}.md` (50 шт.) |

### Service Worker

Генерируется скриптом `build-sw.mjs`, кеширует все файлы из `_site/` для офлайн-доступа. Стратегия: Cache-First (precache).

## Поток данных

```
lessons.json
     ↓
build-config-meta.mjs
     ↓
src/_data/courseConfig.json  ──→  Eleventy  ──→  HTML (все страницы)
                                        ↑
src/_data/site.json ────────────────────┘
src/_data/assetsHash.json ──────────────┘
src/_data/lessonsData.cjs ──────────────┘
src/_data/eleventyComputed.js ──────────┘
```

### Клиентский рендеринг

HTML-страницы содержат все данные (прогрессивное улучшение). JavaScript добавляет интерактивность:

1. Навигация по разделам/оглавлению
2. Викторины (проверка ответов, подсчёт баллов)
3. Прогресс (чтение/запись localStorage + синхронизация с сервером)
4. Поиск (фильтрация списка уроков)
5. Бейджи (проверка условий, отображение)
6. Тема (переключение, сохранение в localStorage)

## Зависимости

Все зависимости — devDependencies. Продакшен-сборка не требует Node.js (чистый HTML/CSS/JS).

| Пакет | Версия | Роль в архитектуре |
|---|---|---|
| `@11ty/eleventy` | ^3.0.0 | SSG — преобразует Markdown + Nunjucks в HTML |
| `esbuild` | ^0.24.0 | Бандлинг и минификация JS/CSS |
| `highlight.js` | ^11.10.0 | Подсветка кода на клиенте |
| `markdown-it` | ^14.1.0 | Парсинг уроков из Markdown в HTML |
| `markdown-it-anchor` | ^9.2.1 | Генерация якорей для заголовков |
| `nunjucks` | ^3.2.4 | Шаблонизация страниц |
| `terser` | ^5.37.0 | Опциональная минификация JS |