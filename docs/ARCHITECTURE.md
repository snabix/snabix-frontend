# Архитектура frontend

Документ описывает устройство `snabix-frontend`.

## Назначение

Frontend отвечает за:

- публичную витрину объявлений;
- каталог категорий;
- публичные детальные страницы объявлений;
- регистрацию, вход и состояние сессии;
- личный кабинет пользователя;
- создание и редактирование объявлений;
- избранное;
- настройки профиля, адресов, сессий и уведомлений;
- legal-страницы;
- адаптивный интерфейс и тему.

Backend остается источником истины для бизнес-правил. Frontend может улучшать UX-валидацию, но не должен заменять backend-валидацию.

## Технологии

- Next.js 16 App Router.
- React 19.
- TypeScript strict.
- Zod для API parsing.
- Zustand для client-state.
- React Hook Form для форм.
- Playwright для e2e.
- Vitest для unit/integration.

## Структура

```text
src/app                 маршруты Next.js
src/screens             screen-level страницы
src/features            бизнес-фичи frontend
src/entities            UI и типы сущностей
src/shared              API client, UI primitives, helpers
tests/e2e               Playwright сценарии
```

## API-слой

API-запросы должны идти через adapters в `src/features/*/api` или `src/shared/api`.

Правила:

- не использовать raw `fetch` в UI-компонентах без необходимости;
- валидировать ответы Zod-схемами;
- при изменении backend DTO обновлять frontend schema;
- для приватных страниц корректно обрабатывать `401` и `419`.

### Публичная витрина

Главная, категория и детальная страница объявления получают основной контент в
Server Components. Серверные adapters используют native `fetch` через
`src/shared/api/server-request.ts`, валидируют DTO той же Zod-схемой и задают
явный `revalidate`:

- списки и детали объявлений: 60 секунд;
- дерево категорий: 1 час.

Server API client не принимает request cookies и всегда использует
`credentials: "omit"`. Поэтому initial HTML содержит только публичные данные и
нейтральное `isFavorite=false`; состояние избранного конкретного пользователя
подмешивается после hydration через browser Axios/Sanctum client. Фильтры и
пагинация после первого ответа остаются интерактивными client-side.

Metadata и Open Graph для категории и объявления строятся из публичного DTO на
сервере. При недоступности API страница показывает контролируемое состояние, а
реальный `404` объявления или категории преобразуется в Next `notFound()`.

### Client boundaries

`"use client"` ставится только на entry point, которому непосредственно нужны
React state/effects/context, browser API или интерактивная библиотека. Leaf
presentation внутри уже существующего client graph отдельной директивы не
требует. Статические категории главной рендерятся на сервере, а фильтры,
favorites и пагинация изолированы в `home-listings-section.tsx`.

Обычные callbacks называются `onChange`, `onRetry`, `onOpenChange` и аналогично.
Суффикс `Action` зарезервирован для настоящих Server Actions. ESLint и
`npm run architecture:client` запрещают `on*Action` и контролируют budget
client entry points. Baseline и решения по UI-kit описаны в
`CLIENT_COMPONENTS_AND_SHADCN.md`.

## Сессия

Состояние сессии обслуживается в:

```text
src/features/auth/session/session-provider.tsx
src/features/auth/session/auth-guard.tsx
src/entities/user/model/store.ts
```

При `401` или `419` frontend должен очищать пользователя и переводить UI в состояние истекшей сессии.

## Тема и hydration

Корневой layout серверно отдает безопасную светлую тему. До hydration
`next/script` со стратегией `beforeInteractive` читает канонический режим
`light`, `dark` или `system`, применяет класс только к `<html>` и тем самым
предотвращает flash неверной темы.

`suppressHydrationWarning` разрешен только на `<html>`, потому что bootstrap
намеренно меняет его `class`, `data-theme` и `color-scheme`. На `<body>` и ниже
подавление запрещено: реальные расхождения должны попадать в React console и
ломать regression test. Старые значения `manual`/`auto` автоматически
мигрируют в явную тему или `system`.

## Объявления

Форма объявления разделена на секции и hooks:

```text
src/features/listing/ui/listing-form.tsx
src/features/listing/ui/listing-editor-form.tsx
src/features/listing/model/use-listing-category-state.ts
src/features/listing/model/use-listing-attribute-state.ts
src/features/listing/model/use-listing-address-state.ts
src/features/listing/model/use-listing-media-state.ts
src/features/listing/model/use-listing-submit.ts
```

Создание и редактирование должны использовать общую структуру формы, чтобы не расходились UX и payload.

## Управление объявлениями

Owner actions находятся в:

```text
src/features/listing/model/listing-owner-actions-policy.ts
src/features/listing/ui/listing-management-menu.tsx
```

Frontend policy отвечает только за отображение действий. Backend все равно обязан проверять права.

## Медиа

Frontend отображает и отправляет медиа, но не решает, какие файлы можно удалить из storage. Постоянное удаление медиа выполняется backend-доменом.

Правила:

- preview blob можно показывать локально;
- remote media должны приходить из API;
- reorder и main image отправляются отдельными API-действиями;
- лимит изображений должен совпадать с backend.

## Дизайн

Сайт использует собственную визуальную систему Snabix:

- светлая и темная тема;
- логотипы для разных тем;
- карточки объявлений;
- каталог с иконками корневых категорий;
- премиальные анимации без перегруза интерфейса.

Новые UI-решения должны сохранять текущий стиль, а не вводить случайные визуальные паттерны.

## Связанные документы

- `FILE_SIZE_GUIDELINES.md`
- `CLIENT_COMPONENTS_AND_SHADCN.md`
- `LOCAL_DEVELOPMENT.md`
- `TESTING_STRATEGY.md`
- `SECRETS.md`
- backend `.docs/LISTING_LIFECYCLE.md`
- backend `.docs/MEDIA_LIFECYCLE.md`
- backend `.docs/NOTIFICATIONS_ARCHITECTURE.md`
- единый межрепозиторный аудит: `$PROJECT_ROOT/snabix-backend/.docs/TECHNICAL_AUDIT.md`
