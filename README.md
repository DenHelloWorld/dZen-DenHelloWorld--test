# Orders & Products

SPA "Orders & Products" — тестовое задание уровня Junior+ (React/Next.js).

Оригинальный ТЗ: [`docs/assignment/JavaScript _ ReactJS.pdf`](docs/assignment/JavaScript%20_%20ReactJS.pdf). Полный статус выполнения по пунктам ТЗ — [`CHECKLIST.md`](CHECKLIST.md).

## Требования

- [Git](https://git-scm.com/) — клонировать репозиторий
- [Docker](https://docs.docker.com/get-docker/) + Docker Compose — для быстрого запуска (см. ниже); Docker Desktop на Windows/macOS уже включает Compose, на Linux — ставится отдельно
- [Node.js 20+](https://nodejs.org/) и локальный MySQL — только если запускать без Docker (раздел «Локальная разработка» ниже)

## Быстрый старт (Docker) — для проверки/QA

```bash
git clone https://github.com/DenHelloWorld/dZen-DenHelloWorld--test.git
cd dZen-DenHelloWorld--test
```

Скопировать `.env.example` в `.env`:

```bash
# macOS / Linux / Git Bash
cp .env.example .env
```

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

```bat
:: Windows cmd
copy .env.example .env
```

Затем:

```bash
docker compose up --build
```

Значения по умолчанию в `.env.example` рабочие — редактировать `.env` для локальной проверки не нужно.

После старта:

- Приложение: http://localhost:3000
- WebSocket-сервер: http://localhost:4001
- MySQL: localhost:3306 (данные — в volume `mysql_data`, схема накатывается автоматически из `db/schema.sql`)

БД поднимается пустой (только схема) — данные нужно засеять один раз:

```bash
docker compose exec web npm run seed
```

Демо-логин: имя пользователя `admin`, пароль `admin123`.

## Локальная разработка (без Docker)

Требуется Node.js 20+ и локальный MySQL (или `docker compose up mysql` — поднять только БД).

```bash
npm install
cp .env.example .env
# .env: MYSQL_HOST=localhost, остальные значения — под свою БД

npx prisma generate
npm run seed        # заполнить БД демо-данными

npm run dev          # Next.js на :3000
```

WebSocket-сервер (счётчик активных вкладок) — отдельный процесс:

```bash
cd ws-server
npm install
cp ../.env.example .env   # либо свой .env с WS_PORT/WS_CORS_ORIGIN
npm run dev           # на :4001
```

## Стек

- **Next.js 16** (App Router, TypeScript) — фронтенд и бэкенд (REST через Route Handlers) в одном приложении
- **Redux Toolkit** + **RTK Query** — состояние и обращения к REST API
- **Prisma 7** (driver adapters, `@prisma/adapter-mariadb`) + **MySQL** — БД
- **Bootstrap 5** + БЭМ (CSS-модули) — вёрстка
- **Socket.io** — отдельный процесс `ws-server/`, счётчик активных вкладок
- **react-leaflet**, **recharts** — карта складов и график по товарам (оба lazy через `next/dynamic`)
- **JWT** (httpOnly-cookie) — авторизация
- **i18n** (ru/en) — URL-based роутинг (`app/[lang]/`)
- **Jest + React Testing Library** — unit-тесты (frontend + backend), 80%+ покрытие
- **Docker / docker-compose** — контейнеризация

## Функции

- Приходы: список, детали сбоку, удаление с подтверждением, даты/суммы в нескольких форматах и валютах
- Товары: список, фильтр по типу, детали сбоку, удаление, график по типам (bar-чарт: количество / средняя цена)
- Группы: обзор категорий товаров с агрегацией, переход к отфильтрованному списку товаров
- Склады: список + карта расположения (react-leaflet)
- Настройки: переключение языка, сброс сохранённых в localStorage данных
- Живые часы и счётчик активных вкладок (WebSocket) в шапке

Подробный чек-лист соответствия ТЗ — в [`CHECKLIST.md`](CHECKLIST.md).

## Переменные окружения

См. [`.env.example`](.env.example) — полный список с комментариями. Ключевые:

| Переменная                  | Назначение                                                 |
| --------------------------- | ---------------------------------------------------------- |
| `MYSQL_*`                   | Доступ к MySQL (host/port/user/password/database)          |
| `JWT_SECRET`                | Секрет для подписи JWT сессии                              |
| `NEXT_PUBLIC_WS_URL`        | URL WebSocket-сервера, виден клиенту (инлайнится в сборку) |
| `WS_PORT`, `WS_CORS_ORIGIN` | Порт и allowed origin для `ws-server/`                     |

## Скрипты

| Команда                 | Что делает                                 |
| ----------------------- | ------------------------------------------ |
| `npm run dev`           | Dev-сервер Next.js                         |
| `npm run build`         | Продакшн-сборка (standalone output)        |
| `npm run start`         | Запуск собранного продакшн-сервера         |
| `npm run lint`          | ESLint (flat config)                       |
| `npm run format`        | Prettier — автоформат                      |
| `npm run seed`          | Засеять БД демо-данными (`prisma/seed.ts`) |
| `npm test`              | Jest — все unit-тесты                      |
| `npm run test:coverage` | Jest с отчётом покрытия                    |

## Тесты

```bash
npm test               # 46 test suites, 200 тестов
npm run test:coverage  # покрытие: 97.9% stmts / 87.5% branch / 83.3% func / 97.9% lines
```

Frontend (Jest + RTL, `jsdom`) — форматтеры, i18n, хуки, RTK Query, общие компоненты, все `*View`/`*Panel`/`*Chart` и `page.tsx` (Server Components, паттерн `render(await Page())`).

Backend (Jest, `@jest-environment node`) — все 5 route-хендлеров (`app/api/**`), Prisma полностью замокан (`jest.mock('@/lib/prisma')`) — тесты не обращаются к реальной БД.

Порог покрытия зашит в [`jest.config.ts`](jest.config.ts) (`coverageThreshold`) и падает прогоном тестов, если просядет.

## Структура проекта

```
src/
  app/
    [lang]/              # локализованные страницы (App Router)
      (app)/              # приватная зона: Orders/Products/Groups/Warehouses/Users/Settings
      login/
    api/                  # REST — Route Handlers (auth/orders/products)
  lib/                    # форматтеры, i18n, доступ к данным (Prisma), JWT
  hooks/                  # useLocalStorageValue, useEscapeToClose, useFocusTrap
  store/                  # Redux Toolkit + RTK Query (api.ts)
  generated/prisma/       # сгенерированный Prisma-клиент (не в git, `prisma generate`)
prisma/
  schema.prisma
  seed.ts
db/
  schema.sql              # схема для docker-entrypoint mysql
ws-server/                # отдельный Socket.io-процесс (свой package.json)
docs/assignment/          # оригинальное ТЗ и референсы
```

## Docker: сборка вручную

`Dockerfile` (корень) содержит стадии `dev` и `runner` (прод, standalone-выход Next.js); `ws-server/Dockerfile` — `dev` и `runner`. `docker-compose.yml` по умолчанию собирает продакшн (`target: runner`) для `web` и `ws`.

```bash
docker build --target runner -t orders-products-web .
docker build --target runner -t orders-products-ws ./ws-server
```
