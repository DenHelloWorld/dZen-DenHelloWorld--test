# Чек-лист выполнения ТЗ — SPA "Orders & Products" (уровень Junior+)

Оригинальный ТЗ: [`docs/assignment/JavaScript _ ReactJS.pdf`](docs/assignment/JavaScript%20_%20ReactJS.pdf). Референсные скрины макета: [`docs/assignment/img/`](docs/assignment/img/). Референс полей/связей Orders↔Products: [`docs/assignment/app.js`](docs/assignment/app.js).

Статус обновляется по ходу разработки. `[x]` — сделано, `[ ]` — не начато. Пункты, помеченные текстом "(ждёт docker compose up)", технически реализованы в коде, но не проверены end-to-end без поднятой БД.

**Порядок работы:** без деления на фазы "мок → бэкенд" — сразу реальный backend, без mock-данных. Список ниже выполняется по порядку сверху вниз, один пункт = один коммит.

**Архитектура backend'а:** без отдельного NestJS-сервиса — REST реализован как Next.js Route Handlers (`app/api/**/route.ts`) в том же приложении, с Prisma поверх MySQL. JWT выдаётся Route Handler'ом `/api/auth/login` и хранится в httpOnly-cookie, приватные роуты защищает `proxy.ts` (переименованный в Next.js 16 `middleware`). Единственный отдельный процесс — маленький Socket.io-сервер для счётчика вкладок.

**Важно:** т.к. mock-данных нет, ни одна страница с данными не заработает и не будет проверена в браузере, пока не поднят MySQL. Поэтому `docker-compose.yml` с сервисом `mysql` поднимается одним из первых пунктов — как только у вас установлен Docker, дальше можно проверять каждый следующий шаг сразу по готовности.

**Линтинг:** ESLint (flat config, генерируется Next.js CLI) + Prettier — `npm run lint` должен быть чистым перед каждым коммитом, наравне с тестами.

**UI-конвенция:** ТЗ отдельными пунктами требует и БЭМ, и Bootstrap — оба должны быть явно видны в коде, а не только на корне страницы. Поэтому каждый значимый элемент компонента получает свой BEM-класс через CSS-модуль (`*.module.scss`, `composes: ... from global`, см. `page.module.scss`, `form.module.scss`), даже если этот класс всего лишь оборачивает Bootstrap-утилиты/компоненты (grid/flex-утилиты, Modal, Offcanvas, Dropdown, Badge, Spinner, Table и т.д.) без собственного кастомного CSS — так одновременно демонстрируются оба обязательных пункта ТЗ. Литеральные Bootstrap-классы прямо в JSX без BEM-обёртки — исключение, а не норма. Для иконок — пакет `bootstrap-icons` (официальный набор Bootstrap, согласован по стилю); Next.js сам по себе никакого набора иконок не поставляет — в `public/` ничего декоративного нет и добавлять не нужно.

**REST + Redux:** все обращения фронтенда к `app/api/**` идут через RTK Query (`createApi`/`fetchBaseQuery` из `@reduxjs/toolkit/query/react`, файл `src/store/api.ts`) — единый паттерн для auth/orders/products с loading/error-состояниями и кэшированием из коробки, закрывает разом пункты ТЗ «Redux» и «REST (Fetch)». Обычный `createAsyncThunk`/ручной `fetch` в компонентах не используется.

## Обязательные технологии и подходы (п.1-9 ТЗ)

- [x] Библиотека управления глобальным состоянием — Redux Toolkit
- [x] Компонентный подход
- [x] Роутинг для навигации — Next.js App Router
- [x] Анимационные эффекты при переходах — CSS transitions/animations (замена Framer Motion)
- [x] ES6 (arrow functions, spread, template strings)
- [x] Сторонние плагины — используются по необходимости
- [x] Git с осмысленной историей коммитов (репозиторий инициализирован, коммиты по этапам)
- [x] WebSocket — счётчик активных вкладок (Socket.io)
- [x] Верстка компонентов по скринам-примерам

## Функциональные требования

- [x] Верстка на базе скринов (`docs/assignment/img/`)
- [x] Отдельные страницы (Orders / Products / Login)
- [x] Navigation Menu с роут-ссылками на Orders и Products (обязательно по ТЗ, п.3)
- [x] TopMenu: дата/время в реальном времени + счётчик активных сессий (Socket.io)

**Остальные пункты меню со скрина — не описаны в ТЗ, но используются как естественный "дом" для Junior+ фич, а не как декоративные заглушки:**

- [x] Группы (`/groups`) — обзор категорий товаров (`type` из Products): количество и средняя цена по каждому типу, клик по категории → детали-панель со ссылкой на `/products?type=...` (реальный префильтр)
- [x] Склады (`/warehouses`) — Maps: карта расположений складов (react-leaflet, demo-пины), lazy-loaded (`next/dynamic`); отдельный пункт меню сверх референс-скрина, добавлен по ходу разработки
- [x] Настройки (`/settings`) — i18n: переключатель языка (ru/en) + Web Storage для сохранения выбора; плюс кнопка сброса всех сохранённых в `localStorage` вкладок с confirm-модалкой
- [x] Компонент Orders: список приходов, клик → раскрытие деталей сбоку, закрытие
  - [x] Название прихода
  - [x] Количество продуктов
  - [x] Дата создания в 2 форматах
  - [x] Сумма прихода в 2 валютах
  - [x] Кнопка удаления → попап подтверждения
- [x] Компонент Products: список продуктов + фильтр по типу (1 select)
  - [x] Название продукта
  - [x] Тип продукта
  - [x] Даты гарантии в разных форматах
  - [x] Цена в разных валютах
  - [x] Название прихода

## Обязательные инструменты для разработчика (все уровни)

- [x] React.js (последняя версия) — через Next.js
- [x] Redux
- [x] CSS Architecture (БЭМ)
- [x] CSS Framework — Bootstrap
- [x] REST (Axios/Fetch) — через RTK Query (fetchBaseQuery)
- [x] Form (Validation) — форма логина
- [x] Git
- [x] Docker (ждёт docker compose up)
- [x] WebSocket (WS)
- [x] ESLint + Prettier (`npm run lint` чистый на каждом коммите)

## Формат результата

- [x] Docker — контейнеризация всего приложения и окружения (ждёт docker compose up)
- [x] Git-репозиторий с историей веток/коммитов
- [x] Read.me с описанием проекта и функций
- [x] Файл схемы БД (MySQL Workbench) — `db/schema.sql`
- [ ] Хостинг/VDS — **вне зоны ответственности ассистента, выполняется пользователем**
- [ ] Видео с демонстрацией — **вне зоны ответственности ассистента, выполняется пользователем**

## Уровень Junior+

- [x] TypeScript (backend + frontend) — весь код (`src/`, `ws-server/`, `prisma/seed.ts`) на `.ts`/`.tsx`, ни одного `.js`
- [x] SSR (Next.js) — Orders страница: Server Component фетчит данные напрямую (Prisma), передаёт как props клиентскому компоненту; `export const dynamic = 'force-dynamic'` не даёт Next.js закэшировать это статически
- [x] Unit-тесты (backend + frontend) — цель: 80%+ покрытие (statements/branches/functions/lines), порог зашит в `jest.config.ts` (`coverageThreshold`) и падает сборкой тестов, если просядет; `npm run test:coverage` — отчёт
- [x] i18n (ru/en) — URL-based (`app/[lang]/`), Accept-Language detection, SSR-ready
- [x] JWT (демо-логин, натяжка под домен; токен в httpOnly-cookie, не в JS)
- [x] Web Storage — последняя открытая карточка/склад/категория запоминается в `localStorage` (`useLocalStorageValue`, общий JSON-хук, синхронизация между вкладками) на Orders/Products/Warehouses/Groups; язык хранится в cookie, см. i18n выше
- [x] Lazy Loading (map — `next/dynamic` с `ssr:false` на `/warehouses`)
- [x] Charts (recharts)
- [x] Maps (react-leaflet, страница "Склады" (`/warehouses`) — демо-локации складов)

## План работ (микрозадачи → коммиты)

Каждый пункт — отдельный коммит. Один пункт → стоп → ждём подтверждения, прежде чем переходить к следующему.

- [x] Scaffold: `git init`, `.gitignore`, `CHECKLIST.md`, перенос эталонных материалов в `docs/assignment/`
- [x] Frontend: каркас Next.js (App Router, TS) + Redux Toolkit + Bootstrap + BEM-стили + проверенный ESLint/Prettier-конфиг (`npm run lint` чистый)
- [x] `db/schema.sql` + `docker-compose.yml` (сервис `mysql`) + `.env.example` — поднять БД как можно раньше, чтобы дальше можно было проверять каждый шаг вживую
- [x] Prisma: `schema.prisma` (User/Order/Product/Price) + `seed.ts` — реальные данные на основе `docs/assignment/app.js` (исправлены баги, ~25 приходов), поверх MySQL
- [x] `app/api/auth/login/route.ts` — проверка demo-пользователя, выдача JWT в httpOnly-cookie + `proxy.ts` guard приватных роутов
- [x] `app/api/orders/route.ts` + `app/api/orders/[id]/route.ts` — list/detail/delete, суммы по валютам
- [x] Login страница + форма с валидацией (Bootstrap) + редирект неавторизованных — вход через RTK Query (`useLoginMutation`); временно редиректит на `/` (заглушка-скаффолд), пока не построен Layout и страница Orders; `proxy.ts` также редиректит уже залогиненного пользователя с `/login` обратно на `/`
- [x] `app/api/products/route.ts` — список + фильтр по типу
- [x] `ws-server/` — отдельный небольшой Node/Socket.io-процесс (свой `package.json`/`tsconfig.json`), счётчик активных вкладок: инкремент/декремент на connect/disconnect, broadcast всем клиентам события `active-tabs`; проверено смоук-тестом с двумя клиентами. Фронтенд ещё не подключён — это пункт TopMenu ниже
- [x] Layout: route group `(app)` со общим `layout.tsx` (не затрагивает `/login`); `Sidebar` — 5 рабочих роутов (Orders/Groups/Products/Users/Settings) с подсветкой активного; `TopMenu` — живые часы (без гидратационных проблем, тик через `useEffect`) + WS-счётчик через `socket.io-client` (`NEXT_PUBLIC_WS_URL`), без строки поиска со скрина (её нет в тексте ТЗ, п.4). `/` теперь редиректит на `/orders`, страницы `/orders`/`/products`/`/groups`/`/users`/`/settings` — пока заглушки, содержимое появится в следующих пунктах плана
- [x] Orders: список (2 формата дат, сумма в 2 валютах, truncate+tooltip на длинных названиях), детали-панель сбоку без сабраута (title/сумма прихода/список продуктов, полные названия без обрезки), delete-модалка — на реальном API через RTK Query; SSR (Server Component фетчит `fetchOrdersList()` напрямую через Prisma, отдаёт как props — реальные данные в первом HTML, без спиннера); Escape закрывает модалку/панель (модалка в приоритете)
- [x] Products: список (62 позиции), фильтр по типу (реальный REST-запрос `?type=`, не клиентская фильтрация), 2 формата дат гарантии, цена в 2 валютах, название прихода, truncate+tooltip на длинных названиях — на реальном API через RTK Query; SSR как у Orders (`fetchProductsList()` напрямую через Prisma, `force-dynamic`). Сверх ТЗ (по референс-скрину, которого нет в тексте ТЗ): клик по карточке → детали сбоку (serial number/condition/specification/гарантия/цена, без доп. фетча — все поля уже есть в списке), кнопка удаления + confirm-модалка (`DELETE /api/products/[id]`) — переиспользуют те же паттерны/компоненты, что и Orders (`DeleteConfirmModal` вынесен в общий `_components/`, принимает `entityLabel`)
- [x] Анимации переходов (роуты / панель деталей / модалка)
- [x] `/settings` — i18n: переключатель языка (ru/en), выбор сохраняется в URL (Next.js i18n routing)
- [x] `db/schema.sql` + `schema.prisma`: таблица `warehouses` (name/address ru+en, lat/lng), сид с 20 демо-складами (Украина/Румыния/Молдова/Польша)
- [x] `/warehouses` — Maps: список складов + деталь-панель с `react-leaflet` картой (демо-пин, `next/dynamic` + `ssr:false`), сгенерирована сразу через Prisma (`fetchWarehousesList`), не статический массив
- [x] `/groups` переосмыслен как обзор категорий товаров (`fetchProductGroups` — агрегация `products` по `type` на лету, без отдельной таблицы): количество + средняя цена в 2 валютах на тип, деталь-панель со ссылкой `/products?type=...` (реальный префильтр, синхронизирован с URL в обе стороны, включая смену языка)
- [x] Web Storage применён единообразно везде: последний открытый заказ/товар/склад/категория — через общий `useLocalStorageValue` (JSON-хук на `useSyncExternalStore`, синхронизация между вкладками, safe fallback при битых данных); `/settings` — кнопка сброса всех четырёх ключей с confirm-модалкой
- [x] Общие компоненты вынесены из повторов: `CurrencyPrices` (мультивалютный вывод, было 7 копий), `SplitPanelLayout` (список+панель с условным gap — попутно исправлен баг с "зависшим" отступом при закрытой панели), `ConfirmModal` (общий шелл, `DeleteConfirmModal` теперь его обёртка) — заодно найдено и исправлено: `DeleteConfirmModal` не был локализован (хардкод английского текста при живых неиспользуемых переводах)
- [x] Терминология приведена к тексту ТЗ: "Заказ" → "Приход" везде в русской локали (ТЗ везде использует "приход", не "заказ клиента")
- [x] Charts (lazy, `next/dynamic`) на странице Products — bar-чарт по типам товаров (`ProductsChart.tsx`, recharts), переключатель метрики "Количество" / "Средняя цена", свой цвет на тип (`Cell`), скрыт за toggle-кнопкой в шапке, lazy через `next/dynamic({ ssr: false })` со спиннером-фолбэком; данные — агрегация `initialProducts` на клиенте (`chart-data.ts`), без доп. запроса
- [x] Unit-тесты frontend (Jest + RTL, `next/jest`) — форматтеры/i18n (`lib/`), хуки (`useLocalStorageValue`/`useEscapeToClose`/`useFocusTrap`), RTK Query `api`-слайс, общие компоненты (`ConfirmModal`/`DeleteConfirmModal`/`CurrencyPrices`/`SplitPanelLayout`/`Sidebar`/`TopMenu`/...), все `*View`/`*Panel`/`*Chart` компоненты и все `page.tsx` (Server Components — паттерн `render(await Page())`), с моками там, где нужно (RTK Query хуки, `next/navigation`, `socket.io-client`, `react-leaflet`, SCSS-модули)
- [x] Unit-тесты backend (Jest, `@jest-environment node`) — все 5 route-хендлеров (`app/api/auth/login`, `app/api/orders`, `app/api/orders/[id]`, `app/api/products`, `app/api/products/[id]`), `@/lib/prisma` замокан целиком (`jest.mock`), без единого обращения к реальной БД; статусы/JSON-формы/ветки ошибок (400/401/404/200, Prisma `PrismaClientKnownRequestError` P2025 → 404, неизвестные ошибки — rethrow); заодно вынесены `tsconfig.build.json` (прод-сборка не завязана на типы тестовых файлов) и `next.config.ts` → `typescript.tsconfigPath`
- [x] Итог по обоим: 46 test suites, 200 тестов, покрытие 97.9/87.5/83.3/97.9% stmts/branch/func/lines (порог в `jest.config.ts` — 95/85/80/95%, с запасом над требуемыми 80%+); `npm test` / `npm run test:coverage`
- [x] `Dockerfile` для Next.js-приложения (стадии `deps`/`dev`/`builder`/`runner`, прод — `output: 'standalone'`) + `Dockerfile` для `ws-server/` (`dev`/`builder`/`runner`) + `.dockerignore` (root и `ws-server/`); `docker-compose.yml`: добавлены `web` (собирается из `target: runner`, `depends_on: mysql` через healthcheck, `MYSQL_HOST=mysql`, `NEXT_PUBLIC_WS_URL` передан и как build arg — инлайнится в клиентский бандл) и `ws` (`target: runner`, `WS_PORT`/`WS_CORS_ORIGIN`); `.env.example` дополнен `WS_PORT`/`WS_CORS_ORIGIN`; `npm run build` (standalone-выход) и YAML-структура `docker-compose.yml` проверены локально — самого `docker compose up --build` без установленного Docker в этой среде не было (см. ниже)
- [x] `README.md` — стек, функции, быстрый старт (Docker и без), переменные окружения, скрипты, тесты, структура проекта, демо-логin (`admin`/`admin123`)
- [ ] Сквозная проверка через `docker compose up --build` (ждёт запуска пользователем — Docker недоступен в среде ассистента)

---

Примечание: пункты, требующие поднятого MySQL, отмечаются как выполненные только после реальной проверки в браузере — см. README.
