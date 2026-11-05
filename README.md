# ИИ для Информатики

Практический сайт с двумя подробными инструкциями по инструментам искусственного интеллекта:

1. **VS Code + Cline** — установка редактора и ИИ-агента, подключение модели по API-ключу, первый проект.
2. **Node.js + opencode 2** — установка Node.js и opencode 2, подключение провайдера, первый запуск в терминале.

Статический сайт: [ai.nayanovaacademy.ru](https://ai.nayanovaacademy.ru)

## Возможности

-   Две пошаговые инструкции с командами для Windows, macOS и Linux
-   Блоки «Проверьте себя» с ответами
-   Разбор типичных ошибок и мер безопасности
-   Поиск по материалам
-   Отслеживание прогресса (localStorage + сервер)
-   Система достижений
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
| **PHP** | Серверная часть (прогресс, бейджи, SSO) |

## Быстрый старт

```bash
npm install       # установка зависимостей
npm start         # режим разработки
npm run build     # полная сборка в _site/
```

Сайт будет доступен по адресу `http://localhost:8080` (или следующему свободному порту).

## Скрипты сборки

| Команда | Описание |
|---|---|
| `npm start` | Режим разработки с hot-reload |
| `npm run build` | Полная сборка для продакшена |
| `npm run build:dev` | Сборка без service worker |
| `npm run deploy` | Сборка + деплой через SSH (PowerShell) |
| `npm run clean` | Удаление `_site` и `node_modules` (POSIX) |

## Структура проекта

```
ai-web/
├── src/                  # Исходники сайта
│   ├── _includes/        # Nunjucks-шаблоны (layout.njk, layout-index.njk)
│   ├── _data/            # Данные Eleventy (site.json, courseConfig.json)
│   ├── _plugins/         # Плагины Eleventy (norun.mjs)
│   ├── css/              # Стили
│   ├── js/               # JavaScript (модули и конфиги)
│   ├── index.njk         # Домашняя страница
│   ├── 01-vscode-cline.md
│   └── 02-nodejs-opencode.md
├── sandbox/              # PHP-бэкенд (SSO, прогресс, бейджи)
├── quizzes/              # Квизы (сейчас пусто — отключены)
├── _site/                # Сгенерированный сайт
├── lessons.json          # Метаданные: 2 инструкции, 1 раздел
└── eleventy.config.mjs   # Конфигурация Eleventy
```

## Деплой

Параметры SSH-деплоя задаются в локальном `.env` (не коммитится):

```
DEPLOY_SSH_HOST=<хост>
DEPLOY_SSH_PORT=22
DEPLOY_SSH_USER=<пользователь>
DEPLOY_SSH_KEY=<путь к ключу>
DEPLOY_REMOTE_PATH=<путь к webroot>
```

```powershell
.\deploy.ps1            # сборка + деплой
.\deploy.ps1 -DryRun    # показать команды без выполнения
.\deploy.ps1 -SkipBuild # задеплоить готовый _site/
```

Скрипт сохраняет серверные `data/` и `quizzes/`, пишет `version.json` и деплоит nginx-конфиг
через `deploy-nginx.sh`.

## Лицензия

Все права защищены. Академия Наяновой.
