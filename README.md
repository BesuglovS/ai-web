# AI — Основы искусственного интеллекта

Образовательный курс **«AI — основы искусственного интеллекта: от теории к практике»** от Академии Ньяяновой.

Статический сайт курса: [ai.nayanovaacademy.ru](https://ai.nayanovaacademy.ru)

## Описание

Курс включает **50 уроков** в **9 разделах**, охватывающих историю AI, математические основы, нейронные сети, трансформеры, обучение моделей, большие языковые модели (LLM), семейство Meta Llama и инструменты для разработчиков (Cline, Opencode, Hermes Agent).

Функции сайта:

-   Поурочное содержание с боковой навигацией
-   Интерактивные викторины
-   Отслеживание прогресса (localStorage + сервер)
-   Система достижений (20 значков)
-   Поиск по урокам
-   Тёмная и светлая темы
-   Подсветка кода (highlight.js)
-   Адаптивный дизайн
-   Service Worker для офлайн-кеширования

## Технологии

| Технология | Назначение |
|---|---|
| **Eleventy v3** | Генератор статических сайтов |
| **Nunjucks** | Шаблонизатор |
| **Markdown-it** | Парсер Markdown |
| **esbuild** | Бандлер JS/CSS |
| **highlight.js** | Подсветка кода |
| **PHP** | Серверная часть (песочница) |

## Быстрый старт

```bash
# Установка зависимостей
npm install

# Режим разработки (с автоперезагрузкой)
npm start

# Полная сборка
npm run build
```

Сайт будет доступен по адресу `http://localhost:8080` (или следующему свободному порту).

## Скрипты сборки

| Команда | Описание |
|---|---|
| `npm start` | Режим разработки с hot-reload |
| `npm run build` | Полная сборка для продакшена |
| `npm run build:dev` | Сборка без service worker |
| `npm run deploy` | Сборка + деплой через SSH (PowerShell) |
| `npm run clean` | Удаление `_site` и `node_modules` |

## Структура проекта

```
ai-web/
├── src/                  # Исходники сайта
│   ├── _includes/        # Nunjucks-шаблоны (layout.njk, layout-index.njk)
│   ├── _data/            # Данные для Eleventy (site.json, courseConfig.json)
│   ├── _plugins/         # Плагины Eleventy (norun.mjs)
│   ├── css/              # Стили (16 partials)
│   ├── js/               # JavaScript (20 модулей)
│   ├── index.njk         # Домашняя страница
│   └── 01-*.md ...       # 50 уроков в Markdown
├── sandbox/              # PHP-бэкенд (аутентификация, прогресс, бейджи)
├── quizzes/              # Данные викторин
├── _site/                # Сгенерированный сайт (результат сборки)
├── *.mjs                 # Скрипты сборки (build-css, build-js, build-sw и др.)
├── lessons.json          # Метаданные курса (50 уроков, 9 разделов)
└── eleventy.config.mjs   # Конфигурация Eleventy
```

## Деплой

Настройки SSH-деплоя задаются в `.env`:

```
DEPLOY_SSH_HOST=79.143.31.184
DEPLOY_SSH_PORT=22
DEPLOY_SSH_USER=root
DEPLOY_REMOTE_PATH=/var/www/ai.nayanovaacademy.ru/public/
```

```bash
npm run deploy
```

## Лицензия

Все права защищены. Академия Ньяяновой.