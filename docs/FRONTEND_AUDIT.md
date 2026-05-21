# Frontend Audit

Дата повторного аудита: 2026-05-20

Контекст продукта: Snabix - marketplace-платформа для товаров и услуг. Frontend должен быть понятным публичным каталогом, аккуратным личным кабинетом и безопасным SPA-клиентом для backend API.

## Проверка

- [x] Повторно просмотрены `AGENTS.md`, `package.json`, App Router routes, FSD-слои, auth/session, categories, listings, profile, shared API.
- [x] Проверено, что проект перешел с Ant Design на shadcn/Radix-based компоненты.
- [x] Проверены frontend API adapters относительно текущих backend endpoints.
- [x] Проверены unit tests, lint и production build.
- [ ] Нужна браузерная проверка через запущенный frontend: mobile header, profile avatar flow, create/edit listing.
- [ ] Нужны E2E smoke tests для основных user journeys.

## Результаты Команд

- `npm run lint` прошел.
- `npm run test` прошел: 8 файлов, 27 тестов.
- `npm run build` прошел.

## Архитектура

Текущая структура близка к FSD:

- `src/app` - App Router, route-level composition.
- `src/screens` - композиция страниц.
- `src/widgets` - крупные layout-блоки.
- `src/features` - пользовательские действия: auth, listing, profile.
- `src/entities` - бизнес-сущности: user, category, listing.
- `src/shared` - API-клиент, UI, config, utils.

Что хорошо:

- [x] App Router почти не содержит бизнес-логики.
- [x] Auth/session flow вынесен в feature layer.
- [x] Category cache хранится в Zustand и используется формой объявления.
- [x] Listing form разбита на hook/model и UI-компоненты.
- [x] Zod/react-hook-form используется в listing и profile/auth формах.
- [x] API-клиент централизован в `shared/api`.
- [x] Анти-паттерн Ant Design зависимости устранен: в `package.json` нет `antd` и `@ant-design/nextjs-registry`.

Что рисково:

- [x] В `src/app/account` нет общего `layout.tsx`; каждая account page вручную оборачивает контент в `AccountLayout`. Это работает, но легко забыть guard/layout на новой странице.
- [ ] `AccountLayout` содержит `AuthGuard` только вокруг `children`, но Header рендерится до проверки сессии. Это нормально для UX, но приватные данные в Header должны оставаться защищенными store-состоянием.
- [ ] Некоторые feature imports идут глубоко из внутренних путей (`features/profile/avatar/lib/...`). Для FSD лучше добавить публичные index-файлы на границах slice.
- [ ] Profile page содержит много интерактивной логики: форма, email verification, avatar viewer/editor, cooldown. Ее стоит разделить на feature hooks/components.
- [ ] Tests лежат рядом с исходниками. Это допустимо, но пользователь хотел отдельную `tests` директорию для frontend: нужно принять правило и перенести unit/integration tests централизованно.

## API Интеграция

### Auth

- [x] `sign-in`, `sign-up`, `forgot-password`, `reset-password`, `logout`, `me`, `resend verification`, `verify code` подключены.
- [x] Axios использует `withCredentials`, `withXSRFToken` и предварительный `/sanctum/csrf-cookie` для unsafe methods.
- [x] `401/419` очищают cookie-session state и отправляют auth event.
- [x] `AuthGuard` редиректит account routes на `/sign-in?redirectTo=...`.
- [x] Registration UX не зависит от автоматического логина после sign-up.

Что добавить:

- [ ] Подключить `POST /api/v1/auth/change-password` к странице безопасности/профиля.
- [ ] Добавить UI для session expiration banner/toast в едином месте, если backend возвращает `401/419`.
- [ ] Добавить integration tests sign-in -> me -> account redirect.
- [ ] Добавить E2E smoke для forgot/reset password.

### Profile

- [x] Profile API и avatar upload вынесены в `features/profile`.
- [x] Avatar upload проверяет размер и тип файла на клиенте.
- [x] Profile edit вынесен в dialog, а просмотр профиля отделен от редактирования.
- [x] Email verification dialog учитывает cooldown.

Что добавить:

- [ ] Разделить `ProfilePage` на `useProfileEditor`, `useAvatarEditor`, `useEmailVerification` и маленькие UI-компоненты.
- [ ] Добавить tests на avatar editor: scale/offset/file type/max size.
- [ ] Добавить optimistic/rollback strategy для профиля и аватара.
- [ ] Убрать hardcoded region/city, когда backend начнет отдавать location fields.

### Categories

- [x] Root categories и branch загружаются.
- [x] Zustand cache для categories и category attributes есть.
- [x] Listing form учитывает `placeholder`, `helpText`, `defaultValue`, `groupName`, `showInCard`.

Что добавить:

- [ ] Реализовать frontend dependency rules: поле B показывается только если поле A имеет нужное значение.
- [ ] Добавить UI для grouped sections с collapse/summary при большом количестве характеристик.
- [ ] Добавить graceful fallback для недоступного category API в header catalog.
- [ ] Добавить tests для category attribute cache invalidation.

### Listings

- [x] Create listing соответствует backend behavior: `pending_review` или `saveAsDraft`.
- [x] Public listing type отделен от private listing type.
- [x] Money parsing валидирует целые числа без копеек.
- [x] Attribute values нормализованы через string keys.

Что исправить:

- [ ] `listPublicListings()` и `listListings()` все еще ожидают `ApiDataResponse<...[]>`, хотя backend уже возвращает `data.items` и `data.meta`. Сейчас это ключевой интеграционный риск.
- [ ] `UpdateListingPayload` пока alias на `CreateListingPayload`; нужно выделить отдельный тип без `saveAsDraft`.
- [ ] Нет frontend API/action для `POST /api/v1/listings/{listingId}/submit-for-review`.
- [ ] Нет UI для публикации черновика после редактирования.
- [ ] Нет UI пагинации и фильтров в `/account/listings`.
- [ ] Нет media upload для объявления.
- [ ] Delete использует `window.confirm`; лучше заменить на shadcn dialog с понятным destructive state.
- [ ] После сохранения форма пушит на `/account/listings/{id}`; маршрут есть, но нужно проверить детали страницы в браузере с реальным API.

## UI/UX

Что хорошо:

- [x] Палитра переведена на OAT `#FFF0E1` и INDIGO `#C8C3FF`.
- [x] Есть единый градиентный background и CSS variables.
- [x] Header/Footer/PublicLayout разделены.
- [x] Главная страница имеет hero, about, carousel и дополнительные секции.
- [x] 404 страница реализована через `not-found.tsx`.

Что добавить:

- [ ] Проверить contrast всех кнопок и badge в dark theme после смены палитры.
- [ ] У унифицированных empty states должен быть shared component, а не локальная верстка в каждой странице.
- [ ] Добавить skeleton вместо простых loader-блоков на profile/listings/categories.
- [x] Account sidebar должен стать layout-level компонентом через `src/app/account/layout.tsx`.
- [ ] Mobile drawer/sidebar нужно проверить в браузере, потому что сейчас sidebar скрыт на `lg` и нет явного mobile account navigation в `AccountLayout`.
- [ ] Главная страница пока больше brand/landing, чем marketplace entry point. Следующий шаг: поиск, быстрые категории, trust badges, карточки объявлений.

## Тестирование

Текущее покрытие:

- [x] Env config tests.
- [x] Auth session tests.
- [x] AuthGuard tests.
- [x] SessionProvider tests.
- [x] Category store tests.
- [x] Listing attribute values tests.
- [x] Listing money tests.
- [x] Listing form schema tests.

Что добавить:

- [ ] Перенести frontend tests в отдельную директорию `tests` или `src/__tests__` после выбора правила. Я рекомендую `tests/unit`, `tests/integration`, `tests/e2e`, чтобы не смешивать product код и проверки.
- [ ] Добавить tests для listing API adapters с `items/meta`.
- [ ] Добавить integration test create listing draft/pending review.
- [ ] Добавить integration test submit draft for review.
- [ ] Добавить tests для profile avatar upload/editor.
- [ ] Добавить E2E smoke: sign-in, profile, create draft, submit for review.

## AGENTS.md

Во время аудита frontend `AGENTS.md` был обновлен: раньше он содержал только предупреждение про Next.js и не фиксировал проектные правила.

Что зафиксировано:

- [x] Явно указана FSD-структура проекта.
- [x] Зафиксировано, что UI-библиотека - shadcn/Radix, а Ant Design не используется.
- [x] Зафиксировано правило API adapters: не доверять backend shape напрямую, использовать DTO unwrap/mappers.
- [x] Зафиксированы обязательные frontend tests для новых forms/API adapters.
- [x] Зафиксирована палитра OAT/INDIGO и запрет случайных цветов вне CSS variables.

## Обновленный План

1. [ ] Исправить listing API adapters под backend `items/meta`.
2. [ ] Выделить `UpdateListingPayload` без `saveAsDraft`.
3. [ ] Добавить frontend action/UI для `submit-for-review`.
4. [x] Вынести `src/app/account/layout.tsx` и убрать ручное оборачивание страниц в `AccountLayout`.
5. [ ] Разделить `ProfilePage` на feature hooks и маленькие компоненты.
6. [ ] Подключить change password endpoint.
7. [ ] Добавить pagination/filter UI для account listings.
8. [ ] Ввести отдельную директорию frontend tests.
9. [ ] Добавить browser/E2E smoke для auth/profile/listings.

## Вывод

Frontend уже пережил важный перелом: ушел от Ant Design, получил FSD-структуру, shadcn/Radix UI, session guard и typed forms. Главный риск сейчас - не визуальный, а контрактный: backend уже развил listing API до пагинации и отдельных действий, а frontend adapters и UI еще не полностью догнали эти изменения. Это стоит закрыть первым, потому что именно объявления являются ядром marketplace.
