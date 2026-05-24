# Frontend Audit

Дата аудита: 2026-05-24

Контекст: Snabix frontend - Next.js 16 App Router marketplace UI для публичных страниц, авторизации, личного кабинета, профиля, объявлений, категорий и будущего каталога. Архитектура следует Feature-Sliced Design: `app -> screens -> widgets -> features -> entities -> shared`.

## Проверка

- [x] Изучены `AGENTS.md`, `package.json`, App Router routes, `src/app`, `src/screens`, `src/widgets`, `src/features`, `src/entities`, `src/shared`.
- [x] Проверены API adapters, auth/session flow, category store, listing forms, media upload, profile/avatar, theme/UI.
- [x] Выполнен `npm run lint`.
- [x] Выполнен `npm run test`: `14 passed`, `42 tests`.
- [x] Выполнен `npm run build`.

## Реализовано

- [x] Next.js App Router с route groups для auth.
- [x] FSD-структура в целом соблюдается.
- [x] Глобальный публичный layout с Header/Footer.
- [x] Account layout через `src/app/account/layout.tsx`.
- [x] AuthGuard для account routes.
- [x] Cookie/Sanctum axios client с CSRF-cookie перед unsafe methods.
- [x] Единый flow для `401/419`: очистка local session state и redirect на sign-in для account routes.
- [x] Sign in, sign up, forgot password, reset password UI.
- [x] Change password form реализована и покрыта тестом.
- [x] User profile, profile edit dialog, email verification dialog.
- [x] Avatar viewer/editor/upload flow покрыт тестами.
- [x] Profile addresses подключены к backend regions/cities.
- [x] Category Zustand cache для roots, branch и category attributes.
- [x] Listing create/edit form использует zod/react-hook-form.
- [x] Listing form использует category store вместо локального дублирования загрузки.
- [x] Attribute values используют string keys.
- [x] Money parsing ограничен целыми числами.
- [x] Create/update listing payloads разделены.
- [x] Submit-for-review action подключен.
- [x] Listing list adapters работают с `data.items` и `data.meta`.
- [x] Account listings имеют фильтры, пагинацию, grid/list view, bulk delete.
- [x] Listing media upload подключен к форме.
- [x] Listing cards показывают gallery controls для нескольких изображений.
- [x] Listing details page имеет gallery, breadcrumbs, actions dropdown.
- [x] Public home показывает публичные объявления без private fields.
- [x] Public home имеет фильтры `category/type/minPrice/maxPrice/sort` и pagination для публичной витрины.
- [x] shadcn/Radix используется как основной UI-kit.
- [x] Ant Design зависимости удалены из `package.json`.
- [x] Theme support реализован через CSS variables и `next-themes`.
- [x] EmptyState и Skeleton shared components используются в ключевых местах.

## Архитектура

### Сильные стороны

- [x] `src/app` в основном отвечает за routing/layout, а не хранит всю page logic.
- [x] `src/screens` собирает страницы и держит крупную композицию.
- [x] `src/features` содержит пользовательские действия: auth, listing, profile.
- [x] `src/entities` хранит user/category/listing/location модели и API.
- [x] `src/shared` содержит api client, ui-kit, config, utils.
- [x] API adapters отделены от UI и используют unwrap helpers.
- [x] Zustand stores используются точечно: user session и category cache.
- [x] Большая profile логика уже частично вынесена в hooks.
- [x] Listing form разбит на model/ui части.

### Риски и нарушения

- [ ] В `src/app/globals.css` остались `.ant-*` классы после миграции с Ant Design. Это не ломает UI, но засоряет дизайн-систему и может вводить в заблуждение.
- [ ] Tests лежат рядом с исходниками. Это допустимо, но команда ранее хотела отдельную директорию tests; нужно принять единый стандарт.
- [x] Public listing API adapter пока передает только `page/perPage`, потому что backend еще не имеет базовых фильтров.
- [ ] UI публичного каталога как отдельной страницы пока отсутствует: есть home и account listings, но нет `/categories` и `/listings`.
- [ ] Category dependency rules отображаются в DTO, но frontend form пока не применяет условную видимость/валидацию.
- [ ] Listing media UI поддерживает upload, но нет reorder/delete existing images/set main image.
- [ ] Existing images в edit form не управляются как полноценная media collection; новые файлы добавляются отдельным upload после save.
- [ ] Нет contract tests, которые защищают frontend adapters от изменения backend DTO.
- [ ] Нет E2E smoke для auth/profile/listings в браузере.
- [ ] Header/Footer показываются глобально, но browser/mobile визуальная проверка после последних изменений не зафиксирована.
- [ ] Некоторые shared UI директории имеют PascalCase (`Header`, `Footer`, `ThemeSwitcher`), а часть shadcn компонентов kebab/lowercase. Не критично, но стиль нейминга стоит унифицировать.
- [ ] В home sections еще используются mock-data. Это нормально для landing, но публичный каталог должен постепенно перейти на реальные API.
- [ ] Theme contrast после смены палитры OAT/INDIGO требует ручной проверки в браузере на реальных карточках, badges и destructive states.
- [ ] Avatar editor покрыт unit tests, но нет browser/E2E проверки canvas/file input поведения.

## API И Контракты

### Auth

- [x] `sign-in` подключен.
- [x] `sign-up` не зависит от auto-login после регистрации.
- [x] `forgot-password` подключен.
- [x] `reset-password` скрывает token от пользователя.
- [x] `change-password` подключен.
- [x] `me` hydrate flow есть.
- [x] `401/419` обрабатываются единым событием.

Задачи:
- [ ] Добавить E2E smoke `sign-in -> me -> account redirect`.
- [ ] Добавить E2E smoke forgot/reset password.
- [ ] Документировать пользовательский UX для истекшей сессии без технического текста.

### Profile

- [x] Profile data view/edit dialog.
- [x] Avatar view/upload/editor.
- [x] Addresses section с region/city.
- [x] Change password form.

Задачи:
- [ ] Добавить optimistic/rollback strategy для profile update.
- [ ] Добавить browser tests на avatar viewer/editor close/upload.
- [ ] Улучшить empty/loading states addresses.

### Categories

- [x] Root categories загружаются через store.
- [x] Branch cache есть.
- [x] Category attributes cache есть.
- [x] `placeholder`, `helpText`, `defaultValue`, `groupName`, `showInCard` частично используются.

Задачи:
- [ ] Реализовать `/categories` catalog page.
- [ ] Реализовать category branch page или category drill-down UI.
- [ ] Применить `dependencyRules` в listing form.
- [ ] Добавить tests на conditional attribute visibility.

### Listings

- [x] Create listing.
- [x] Edit listing.
- [x] Show own listing.
- [x] List owned listings с pagination/filter UI.
- [x] Bulk delete через checkbox.
- [x] Submit draft for review.
- [x] Upload listing images.
- [x] Public listing cards.
- [x] Listing image carousel в cards и details.

Задачи:
- [ ] Реализовать публичную страницу `/listings`.
- [x] Подключить public filters, когда backend отдаст category/type/price/sort.
- [ ] Добавить frontend UI для existing media management: delete, reorder, set main image.
- [ ] Добавить tests для listing API adapters: create/update/list/public/media.
- [ ] Добавить integration test create listing draft/pending review.
- [ ] Проверить edit flow: если media upload после save падает, нужен понятный partial success UX.

## UI И Дизайн-Система

- [x] Палитра OAT `#FFF0E1` и INDIGO `#C8C3FF` вынесена в CSS variables.
- [x] Dark/light theme есть.
- [x] ThemeSwitcher используется в user menu.
- [x] Shared Button/Input/Dialog/Checkbox/Avatar/Skeleton/EmptyState есть.

Задачи:
- [ ] Удалить legacy `.ant-*` CSS из `globals.css`.
- [ ] Проверить contrast всех кнопок, badges, destructive states в dark theme.
- [ ] Унифицировать naming shared UI директорий.
- [ ] Добавить shared pagination component вместо локальной верстки.
- [ ] Добавить shared listing media gallery component для cards/details/forms, чтобы не размножать разные паттерны.
- [ ] Провести browser QA mobile header, footer, account sidebar, listing cards.

## Уязвимые Места

- [ ] Frontend доверяет ряду DTO напрямую через TypeScript types без runtime validation на границе API.
- [ ] Cookie/session flow зависит от корректной backend/CORS/Sanctum production настройки.
- [ ] File upload UX пока не имеет retry/rollback для частичного падения после создания объявления.
- [ ] Public catalog отсутствует как полноценная пользовательская точка входа.
- [ ] Нет E2E проверок критичных пользовательских сценариев.

## План Задач

1. [ ] Удалить legacy Ant Design CSS из `globals.css`.
2. [ ] Добавить contract tests для ключевых API adapters: auth me, listings, public listings, category attributes.
3. [ ] Реализовать `/listings` публичную страницу с pagination и будущими фильтрами.
4. [ ] Реализовать `/categories` страницу каталога.
5. [ ] Применить `dependencyRules` в listing form.
6. [ ] Добавить listing media management UI: delete, reorder, main image.
7. [ ] Добавить partial success/rollback UX для listing save + media upload.
8. [ ] Вынести tests в отдельную директорию или зафиксировать colocated-tests как официальный стандарт.
9. [ ] Провести browser/E2E smoke для auth/profile/listings.
10. [ ] Провести visual QA dark/light/mobile и исправить contrast.

## Вывод

Frontend уже выглядит как полноценный продуктовый интерфейс, а не шаблон: FSD в целом соблюдается, auth/session flow зрелый, объявления и профиль связаны с backend. Главные риски теперь контрактные и продуктовые: нужен публичный каталог, фильтры, media management, dependency rules и E2E/contract tests, чтобы изменения backend не ломали UI незаметно.
