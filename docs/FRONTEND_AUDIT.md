# Frontend Audit

Дата: 2026-05-17

## Статус Проверки

- [x] Проверен API-контур авторизации, профиля, категорий и объявлений.
- [x] Проверена сборка Next.js App Router.
- [x] Проверен lint.
- [x] Проверена production-сборка.
- [x] Исправлен контракт создания объявления после backend-изменений.
- [x] Исправлена типизация публичных объявлений без приватных owner/contact-полей.
- [ ] Провести браузерную проверку основных сценариев через запущенный frontend.
- [ ] Вернуть `npm run test` или зафиксировать выбранный frontend test runner.
- [ ] Добавить интеграционные тесты форм объявлений и auth-flow.

## Закрытые Пункты Аудита

- [x] `CreateListingPayload` больше не содержит backend-модерационные поля `status`, `isFeatured`, `rejectionReason`.
- [x] Создание объявления разделяет сценарии `pending_review` и `saveAsDraft`.
- [x] Текст успеха формы объявлений приведен к backend-поведению: черновик или отправка на проверку.
- [x] Добавлен `PublicListingItem`, потому что публичный API intentionally не возвращает приватные поля владельца.
- [x] Убрано ESLint-предупреждение в `ThemeSwitcher`.
- [x] После `401` есть единая redirect policy для закрытых account routes.
- [x] Account routes защищены единым `AuthGuard`.
- [x] Registration flow больше не ломает UX, если backend перестанет логинить пользователя сразу после sign-up.
- [x] Axios использует `withCredentials` и CSRF-cookie для cookie/Sanctum flow.

## Архитектура

Текущая структура близка к Feature-Sliced Design:

- `src/app` отвечает за роутинг и Next.js layouts/pages.
- `src/screens` содержит композицию страниц.
- `src/widgets` содержит крупные layout-блоки.
- `src/features` содержит пользовательские действия: auth, listing, profile.
- `src/entities` содержит бизнес-сущности: user, category, listing.
- `src/shared` содержит API-клиент, UI, config, lib.

### Что Хорошо

- App Router не перегружен бизнес-логикой.
- API-клиент вынесен в `shared/api`.
- Есть отдельные entity-типы и feature API-функции.
- Zustand используется точечно для user/category state.
- Cookie/Sanctum flow учитывает CSRF-cookie перед unsafe-запросами.
- Есть unit-тесты для env, session и category-store.
- UI уже имеет общий визуальный язык через CSS variables.

### Что Нарушено Или Рисково

- [x] `features/listing/ui/listing-form.tsx` разгружен: загрузка данных, состояние формы, рендер характеристик и submit-логика разделены.
- [x] `listing-form.tsx` разбит на `model/use-listing-form-state`, `ui/category-picker`, `ui/attribute-fields`, `ui/listing-submit-actions`.
- [x] В форме объявлений добавлена schema-валидация через `zod/react-hook-form`.
- [x] `attributeValues` нормализованы под `Record<string, value>` во frontend-state и payload mapper.
- [x] Денежные значения валидируются и парсятся как целые числа без копеек.
- [x] Добавлен единый слой unwrap для API-ответов через `shared/api/response`; полноценные runtime DTO validators можно добавить позже при необходимости.
- [x] Cookie-only session helpers переименованы так, чтобы не вводить в заблуждение по поводу hydration/token-cleanup поведения.
- [x] В публичной главной странице добавлен graceful fallback, если API объявлений недоступен.
- [x] Импорты для entity/feature API унифицированы через публичные index/barrel там, где код находится за пределами собственного slice.
- [x] `antd` и `@ant-design/nextjs-registry` удалены из зависимостей и импортов.
- [x] Миграция оставшихся `antd`-компонентов на `shadcn/ui` завершена.

## API И Backend-Интеграция

### Auth

- [x] `sign-in`, `sign-up`, `forgot-password`, `reset-password`, `logout`, `me` подключены через axios.
- [x] CSRF-cookie запрашивается перед `POST/PATCH/DELETE`.
- [x] После `401` закрытые account routes перенаправляют пользователя на sign-in.
- [x] Account layout использует единый `AuthGuard`.
- [x] После регистрации frontend корректно обрабатывает сценарий без автоматического логина.

### Profile

- [x] Профиль и avatar API вынесены в features/profile.
- [ ] Нужны тесты avatar upload/delete UI.
- [ ] Нужна проверка размера/типа аватарки на клиенте до отправки.
- [ ] Нужен единый optimistic/rollback подход для обновления профиля и аватара.

### Categories

- [x] Root categories и branch загружаются.
- [x] Есть Zustand-cache для категорий.
- [x] `ListingForm` использует `useCategoryStore` вместо локальных category-запросов.
- [x] Добавлен отдельный cache для `category attributes`.
- [x] UI формы учитывает `placeholder`, `helpText`, `defaultValue`, `groupName`, `showInCard`.

### Listings

- [x] Создание объявления приведено к backend-контракту `pending_review` / `saveAsDraft`.
- [x] Публичные объявления типизированы отдельно от пользовательских.
- [ ] Update listing сейчас использует тот же payload shape, что create. Лучше выделить отдельный `UpdateListingPayload`, без `saveAsDraft`.
- [ ] Нет UI для публикации черновика после редактирования. Нужен отдельный backend action или frontend flow.
- [ ] Нет фильтров/статусов в списке личных объявлений.
- [ ] Нет media upload для объявления.
- [ ] Нет пагинации в личном и публичном списке.
- [ ] Нет optimistic delete или shadcn-dialog вместо `window.confirm`.

## UI/UX

- [x] Общий стиль переведен на OAT `#FFF0E1` и INDIGO `#C8C3FF` с темными производными для dark theme.
- [x] Header, Footer, PublicLayout, AccountLayout разделены.
- [ ] Главная страница сейчас больше похожа на техническую витрину; нужен полноценный marketplace home: поиск, категории, доверие продавца, карточки.
- [ ] Account sidebar и profile UX нужно проверить на mobile в браузере.
- [ ] Нужно добавить skeleton-компоненты вместо простых loader-блоков.
- [ ] Empty states уже есть, но их нужно унифицировать в shared component.
- [ ] Для кнопок destructive actions нужен подтверждающий Dialog.
- [ ] Нужно проверить contrast dark-theme на всех формах и карточках.

## Тестирование

Текущий результат:

- `npm run lint` прошел без предупреждений.
- `npm run build` прошел.
- `npm run test` не запускался: в текущем `package.json` нет `test` script.

Что добавить:

- [ ] Добавить frontend test runner и `npm run test`.
- [ ] Тест `ListingForm`: отправка на проверку не отправляет `saveAsDraft`.
- [ ] Тест `ListingForm`: сохранение черновика отправляет `saveAsDraft: true`.
- [ ] Тест `ListingForm`: required-характеристики показывают backend validation errors.
- [x] Тестируемая session redirect policy реализована на уровне `AuthGuard` и `401` event flow.
- [ ] E2E smoke: sign-in, profile, create listing draft, create listing pending review.

## Рекомендованный План

1. [x] Разбить `ListingForm` на маленькие FSD-компоненты и hooks.
2. [x] Добавить `zod`-схему объявления.
3. [x] Реализовать `AuthGuard` для account routes.
4. [x] Добавить кеш характеристик категорий.
5. [ ] Добавить UI статусов и фильтры в `/account/listings`.
6. [ ] Подготовить media upload для объявлений.
7. [ ] Добавить E2E smoke-тесты после стабилизации create/edit listing flow.
