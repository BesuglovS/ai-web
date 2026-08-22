# AGENTS.md — Инструкции для ИИ-ассистентов

Статический образовательный сайт «AI — Основы искусственного интеллекта» (50 уроков, русский язык).
Сайт генерируется **Eleventy (11ty) v3** из Markdown, интерактив — vanilla JS (ES-модули, без фреймворков),
серверная часть — тонкий PHP-бэкенд (`sandbox/`) для SSO-авторизации, прогресса (SQLite) и бейджей.
Метаданные курса — в `lessons.json`. Прод: `https://ai.nayanovaacademy.ru`.

## ⚠️ Критические правила

1. **`lessons.json` — единственный источник истины** для метаданных уроков (number, slug, title,
   section, description, duration, complexity, tags, quiz). Генерируемые файлы НЕ редактировать вручную:
   `src/_data/courseConfig.json`, `src/_data/assetsHash.json`, `_site/sw.js` и всё содержимое `_site/`.
2. **`src/js/config/courseData.js` дублирует метаданные на клиенте и синхронизируется вручную** —
   при изменении `lessons.json` обновляйте и его, и `src/_data/courseConfig.json` (через `build:config-meta`).
3. **`_site/` — вывод сборки.** Правки только в `src/`, затем пересборка. `data/` локально пуст —
   SQLite-БД создаётся на сервере в рантайме, не заполняйте и не копируйте его.
4. **Не коммитьте** `.env`, `_site/`, `node_modules/`, `data/*.db*` (см. `.gitignore`).
5. **49 из 50 уроков — TODO-заготовки** (`[TODO: ...]` в `src/NN-slug.md`). Не считайте уроки написанными.
6. **Квизы фактически не работают**: `initQuiz` не вызывается в `script.js`, `quiz.js` ищет квизы по пути
   `/data/quizzes/quiz-N.json`, а сборка кладёт их в `_site/quizzes/`. Не «чините» вслепую — спроектируйте
   единый путь и проверьте через nginx-catch-all.
7. **SSO**: единая авторизация через `auth.nayanovaacademy.ru` (кука `auth_session`). Не вводите
   локальные JWT/сессии — `sandbox/Auth.php` это шим поверх `AuthClient`.
8. **localStorage**: ключи с префиксом `ai-web-`, доступ только через `utils.js`/`config/security.js`.
   Известный баг: в `theme.js` фактический ключ `ai-web-ai-web-theme` — не усугубляйте.
9. **Песочница кода отключена** (`SANDBOX_ENABLED=false`, `run.php` всегда ошибка). Не включайте — риск выполнения кода.
10. **Канонические URL в `layout.njk` неверны** (`.../{fileSlug}.html` вместо `/{slug}/`). Не «чините» без
    проверки работы сервис-воркера и SEO. Корневые `404.html`/`offline.html` не деплоятся — nginx отдаёт
    `index.html` для отсутствующих путей.

## 🔧 Команды (Node ≥ 18)

```bash
npm install                 # установка зависимостей
npm start                   # дев-режим: npx @11ty/eleventy --serve
npm run build               # полная сборка в _site/ (порядок см. ниже)
npm run build:dev           # сборка без service worker
npm run build:css           # только CSS → _site/css/main.css
npm run build:js            # только JS + hljs
npm run build:sw            # генерация _site/sw.js
npm run build:config-meta   # перегенерация courseConfig.json из lessons.json
npm run build:assets-hash   # перегенерация assetsHash.json (кэш-бастер ?v=)
npm run clean               # ⚠️ POSIX-only (rm -rf) — НЕ запускать в Windows PowerShell
npm run deploy              # деплой (powershell deploy.ps1)
```

> В dev-режиме `eleventy.after` пересобирает только CSS/JS. После правки `lessons.json` вручную
> запустите `npm run build:config-meta` (+ `build:assets-hash`), иначе данные не обновятся.

## 🏗 Структура

```
src/*.md                     # Уроки 01–50 (Markdown, русский; 49 из 50 — TODO-заготовки)
src/_includes/layout.njk     # Шаблон урока; layout-index.njk — главная
src/_data/                   # site.json, lessonsData.cjs, eleventyComputed.js, courseConfig.json (ГЕНЕРИРУЕТСЯ), assetsHash.json (ГЕНЕРИРУЕТСЯ)
src/css/index.css            # точка входа CSS (15 partials _*.css в фиксированном порядке)
src/js/script.js             # точка входа JS (ESM); initApp() на DOM-ready
src/js/modules/*.js          # ~20 изолированных модулей (initXxx())
src/js/config/*.js           # security.js, courseData.js (дублирует lessons.json — синхронизировать вручную)
src/_plugins/norun.mjs       # плагин markdown-it (класс `norun` — не используется уроками)
lessons.json                 # метаданные 50 уроков + секции (источник истины)
quizzes/quiz-{NN}.json       # квизы (есть только quiz-1.json)
sandbox/*.php                # PHP-бэкенд: SSO auth, прогресс, бейджи (SQLite data/ai.db)
build-*.mjs, minify.cjs      # скрипты сборки
deploy.ps1                   # деплой по SSH
ai.nayanovaacademy.ru        # nginx-конфиг (деплоится deploy.ps1)
```

## 🛠 Конвейер сборки

`npm run build` (порядок важен):
1. `build-css.mjs` → `_site/css/main.css` (esbuild из `src/css/index.css`)
2. `build-js.mjs` → `_site/js/main.js` (esbuild, ESM, minified)
3. `build-highlight.mjs` → `_site/js/hljs.min.js`
4. `build-config-meta.mjs` → `src/_data/courseConfig.json` из `lessons.json`
5. `build-assets-hash.mjs` → `src/_data/assetsHash.json`
6. `npx @11ty/eleventy` → `_site/{slug}/index.html` + passthrough (css/js/quizzes/sandbox/favicon)
7. `build-sw.mjs` → `_site/sw.js` (последний шаг)

## 📝 Редактирование контента

Front matter урока (точные поля):
```yaml
---
layout: layout.njk
title: "..."
description: "..."
lessonNumber: 2           # должно совпадать с lessons.json
lessonSlug: "02-course-overview"   # совпадает с именем файла NN-slug.md
lessonComplexity: beginner   # beginner|basic|intermediate|advanced
lessonDuration: 8            # целое, минуты
lessonSection: intro         # id секции из lessons.json
---
```

- Скелет: `## <тема>` → `## Проверьте себя` → `## Дополнительные ресурсы`.
- `markdown-it` с `html:true` — сырой HTML проходит (контент доверенный).
- Квиз (`quizzes/quiz-{NN}.json`): `{ "questions": [ { "question", "options": [...], "correct": <индекс с 0>, "explanation" } ] }`, порог `QUIZ_MIN_SCORE = 70`.

## 💻 Конвенции кода

### JavaScript (`src/js/`)
- ES-модули (`import`/`export`), `export function initXxx()`; DOM-хелперы из `utils.js` (`qs`, `qsa`, `on`, `createEl`, `debounce`, `escapeHtml`, `slugify`).
- Порядок инициализации в `script.js`: errorTracking → themeToggle → hamburgerMenu → scrollProgress → keyboardNav → smoothScroll → scrollRestore → breadcrumbs → по типу страницы (index: progress+search; lesson: progress, lesson-meta, toc, section-nav, syntax-highlight, code-toolbar, complete-lesson, badges) → `initAuth()` последним.
- `tracking-client.js` — классический IIFE вне бандла, грузится отдельно, экспортирует `window.NayanovaTrack`.
- Русские строки/комментарии, лог-префиксы `[module]`.

### CSS (`src/css/`)
- `_variables.css` первым (design tokens) → reset → typography → layout → components → code → tables → widgets → interactive → navigation → index → hamburger → auth → responsive → print. BEM-подобные имена.

### PHP (`sandbox/`)
- Хелперы `sandbox_common.php` (`jsonResponse`, `errorResponse`, `setCorsHeaders`, `getJsonBody`); подготовленные statements; WAL.
- CORS: разрешены только `https://ai.nayanovaacademy.ru` и `http://localhost:8080` — новые origin добавлять в `sandbox/config.php`.

## 🧪 Тестирование

Тестов, CI и линтера **нет**. Проверка вручную: `npm run build` → осмотр `_site/` → smoke-тест через `npm start`.

## 🚀 Деплой (`deploy.ps1`)

1. Читает `.env` (`DEPLOY_SSH_HOST/PORT/USER/KEY/REMOTE_PATH`, `SANDBOX_*`).
2. Собирает (флаг `-SkipBuild` пропускает), затем `tar` `_site/` по SSH; удалённо **полное `rm -rf` + распаковка** — без отката.
3. Деплоит nginx-конфиг и перезагружает nginx (`nginx -t && systemctl reload`). ⚠️ Флаг `-DryRun` заявлен, но не объявлен в `param()` — nginx-блок выполняется всегда.
4. Требования сервера: nginx + PHP 8.1-FPM + SQLite, webroot `/var/www/ai.nayanovaacademy.ru/public/`, запись PHP в `public/data/` для `ai.db`.

## 🔒 Безопасность (не ломать)

- CSP в `layout.njk` (`script-src 'self'` + mc.yandex.ru) — при добавлении внешних ресурсов обновляйте CSP и `connect-src` (домены sandbox/auth/contest).
- `tracking-client.js` инициализируется сам, без inline-скриптов (из-за CSP) — сохраняйте этот паттерн.
- Пользовательские данные (ответы квизов, данные lessons.json при рендере) — через `escapeHtml()`.
- `.env` и `ssh-private.key` (в корне `G:\WebSites\na\`) — никогда не печатать и не коммитить.