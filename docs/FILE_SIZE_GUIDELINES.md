# Критерии размера frontend-файлов

Документ фиксирует рабочие лимиты размера файлов и план декомпозиции крупных frontend-файлов. Цель не в том, чтобы механически дробить код, а в том, чтобы файлы оставались удобными для ревью, тестирования и безопасного развития.

## Лимиты

### Production UI

- Целевой размер: до `250-300` строк.
- Допустимый временный размер: до `350` строк, если файл является чистой композицией без сложного state.
- Если UI-файл больше `350` строк, нужен план декомпозиции.

### Hooks и model-файлы

- Целевой размер: до `200-250` строк.
- Если hook больше `250` строк, нужно проверить, не смешивает ли он загрузку данных, derived state, mutations и formatting.

### API schemas, contracts и adapters

- Целевой размер: до `300` строк.
- Если schema-файл больше `300` строк, его лучше делить по API-доменам: auth, catalog, listing, notification, news.
- Общие primitives можно оставить в одном shared-файле.

### Тесты

- Unit/integration tests допустимы до `350-400` строк.
- Если тест больше `400` строк, лучше разделить по behavior-группам.
- E2E tests можно держать крупнее, если это один пользовательский сценарий, но critical paths лучше разделять.

## Когда файл можно оставить крупнее

Файл можно временно оставить выше лимита, если выполняются все условия:

- он почти не содержит state;
- в нем нет сетевых запросов;
- он не смешивает разные домены;
- он редко меняется;
- его структура очевидна и линейна.

Даже в этом случае стоит добавить задачу на декомпозицию, если файл регулярно попадает в изменения.

## Как правильно дробить

Хорошая декомпозиция строится по причинам изменения:

- data loading отдельно от отображения;
- mutation handlers отдельно от layout;
- formatting helpers отдельно от JSX;
- типизированные schemas отдельно по API-доменам;
- reusable UI-подчасти отдельно, если они имеют понятное имя и ответственность.

Плохая декомпозиция:

- `ComponentPart1`, `ComponentPart2`;
- файл на 300 строк превращается в пять файлов по 60 строк без новых смысловых границ;
- props drilling становится сложнее, чем исходный файл;
- private helper выносится в shared только потому, что файл большой.

## Актуальные крупные файлы

Снимок на 01.07.2026:

| Файл | Строк | Категория | Решение |
| --- | ---: | --- | --- |
| `src/screens/account/profile/ui/profile-addresses-section.tsx` | 44 | UI + state | Выполнено: вынесены view/editor/draft-card, hook редактора и formatter адреса |
| `src/entities/listing/ui/listing-card.tsx` | 164 | Entity UI | Выполнено: вынесены media, actions, badges, seller, rating, layouts и formatters |
| `src/screens/account/listings/details/ui/listing-details-page.tsx` | 103 | Page UI + mutations | Выполнено: вынесены hook, formatters, breadcrumbs, hero, description и status card |
| `src/screens/listings/ui/public-listings-page.tsx` | 83 | Page UI + data loading | Выполнено: вынесены hook загрузки, branch panel, content, view switcher и filter params |
| `src/shared/api/api-contracts.test.ts` | 400 | Test | Допустимо, но лучше разделить при следующем росте |
| `src/shared/api/api-schemas.ts` | 4 | API schemas | Выполнено: стал barrel-файлом, схемы разнесены по API-доменам |
| `src/screens/blog/ui/blog-detail-page.tsx` | 33 | Page UI + block renderer | Выполнено: вынесены hero, aside, CTA, renderer, blocks и decor |
| `src/screens/home/ui/home-page.tsx` | 73 | Page UI + data loading | Выполнено: вынесены hook загрузки, drawer, content и view switcher |
| `src/entities/listing/ui/listing-media-gallery.tsx` | 87 | Entity UI + modal + upload grid | Выполнено: facade + card/details galleries, preview dialog, upload grid и normalize helper |
| `src/screens/about/ui/about-page.tsx` | 323 | Static page UI | Можно оставить временно |
| `src/screens/account/listings/ui/listings-page.tsx` | 327 | Page UI + data loading | Разделить при следующем изменении |
| `src/widgets/header/ui/HeaderSessionActions.tsx` | 310 | Header state/actions | Разделить при следующем изменении |

Baseline крупных файлов проверяется командой:

```bash
npm run filesize
```

Если tracked-файл растет, нужно либо декомпозировать его, либо обновить baseline в `scripts/check-file-sizes.mjs` вместе с явным обоснованием в этом документе.

## План декомпозиции по файлам

### `profile-addresses-section.tsx`

Статус: выполнено 01.07.2026.

Проблема: файл смешивает view mode, editor mode, загрузку регионов/городов, drafts, save flow и UI карточек.

Рекомендуемая структура:

```text
src/screens/account/profile/ui/profile-addresses-section.tsx
src/screens/account/profile/ui/profile-addresses-view.tsx
src/screens/account/profile/ui/profile-addresses-editor.tsx
src/screens/account/profile/ui/profile-address-card.tsx
src/screens/account/profile/ui/profile-address-draft-card.tsx
src/screens/account/profile/model/use-profile-addresses-editor.ts
src/screens/account/profile/lib/format-user-address.ts
```

Ожидаемый результат:

- основной section до 80-120 строк;
- editor до 220-260 строк;
- hook до 200-250 строк;
- форматирование адреса переиспользуемое.

### `listing-card.tsx`

Статус: выполнено 01.07.2026.

Проблема: один файл отвечает за grid/list layout, media, favorite, select checkbox, seller, rating, attributes, price, location и hover-effect.

Рекомендуемая структура:

```text
src/entities/listing/ui/listing-card.tsx
src/entities/listing/ui/listing-card-media.tsx
src/entities/listing/ui/listing-card-badges.tsx
src/entities/listing/ui/listing-card-price.tsx
src/entities/listing/ui/listing-card-seller.tsx
src/entities/listing/ui/listing-card-meta.tsx
src/entities/listing/ui/listing-card-actions.tsx
src/entities/listing/lib/listing-card-formatters.ts
```

Правило: `ListingCard` остается публичным API компонента, а подкомпоненты не обязаны экспортироваться из entity index.

Ожидаемый результат:

- `ListingCard` до 180-230 строк;
- formatters отдельно и покрываемы unit-тестами;
- grid/list остаются в одном компоненте, пока это не создаёт сильное ветвление.

### `listing-details-page.tsx`

Статус: выполнено 01.07.2026.

Проблема: page содержит загрузку объявления, mutation handlers, breadcrumbs, formatters, hero/media layout, side details и delete dialog orchestration.

Рекомендуемая структура:

```text
src/screens/account/listings/details/model/use-listing-details.ts
src/screens/account/listings/details/ui/listing-details-page.tsx
src/screens/account/listings/details/ui/listing-details-header.tsx
src/screens/account/listings/details/ui/listing-details-main-section.tsx
src/screens/account/listings/details/ui/listing-details-sidebar.tsx
src/screens/account/listings/details/lib/listing-details-formatters.ts
```

Ожидаемый результат:

- page становится композицией;
- mutation logic уходит в hook;
- formatters можно переиспользовать в personal listing cards.

### `public-listings-page.tsx`

Статус: выполнено 01.07.2026.

Проблема: файл смешивает category branch loading, filters debounce, listing loading, view mode, empty/error states и pagination.

Рекомендуемая структура:

```text
src/screens/listings/model/use-public-listings.ts
src/screens/listings/ui/public-listings-page.tsx
src/screens/listings/ui/public-listings-hero.tsx
src/screens/listings/ui/category-branch-panel.tsx
src/screens/listings/ui/public-listings-content.tsx
src/screens/listings/ui/view-mode-switcher.tsx
src/screens/listings/lib/public-listing-filters.ts
```

Ожидаемый результат:

- page до 150-200 строк;
- data loading отдельно;
- `ViewModeSwitcher` можно переиспользовать на главной.

### `api-schemas.ts`

Статус: выполнено 01.07.2026.

Проблема: файл содержит auth, category, listing, news schemas и общие primitives.

Рекомендуемая структура:

```text
src/shared/api/schemas/common.ts
src/shared/api/schemas/auth.ts
src/shared/api/schemas/category.ts
src/shared/api/schemas/listing.ts
src/shared/api/schemas/news.ts
src/shared/api/api-schemas.ts
```

`api-schemas.ts` должен стать barrel/export файлом, чтобы не ломать импорты.

Ожидаемый результат:

- каждый schema-файл до 150-250 строк;
- изменения listing DTO не затрагивают auth/news schemas;
- strict schema tests можно оставить в `shared/api`.

### `blog-detail-page.tsx`

Статус: выполнено 01.07.2026.

Проблема: страница содержит hero, sticky aside, renderer всех content block types, decorative components и CTA.

Рекомендуемая структура:

```text
src/screens/blog/ui/blog-detail-page.tsx
src/screens/blog/ui/blog-detail-hero.tsx
src/screens/blog/ui/blog-content-renderer.tsx
src/screens/blog/ui/blog-content-blocks.tsx
src/screens/blog/ui/blog-detail-aside.tsx
src/screens/blog/ui/blog-detail-decor.tsx
```

Ожидаемый результат:

- page до 120-160 строк;
- renderer блоков можно тестировать отдельно;
- новые типы блоков не раздувают страницу.

### `home-page.tsx`

Статус: выполнено 01.07.2026.

Проблема: главная страница содержит загрузку публичных объявлений, filters drawer, view mode, carousel и listing grid.

Рекомендуемая структура:

```text
src/screens/home/model/use-home-listings.ts
src/screens/home/ui/home-page.tsx
src/screens/home/ui/home-listings-section.tsx
src/screens/home/ui/home-filters-drawer.tsx
src/screens/home/ui/view-mode-switcher.tsx
```

Решение: общий hook `usePublicListingFeed` пока не вводился, потому что у главной и страницы витрины разные UX-сценарии: drawer-фильтры, разный `perPage`, разные empty/error тексты и сетка. Общий helper оставлен на уровне преобразования фильтров в API-параметры.

### `listing-media-gallery.tsx`

Статус: выполнено 01.07.2026.

Проблема: файл смешивает card gallery, details gallery, preview modal, thumbnails, placeholder и upload grid.

Рекомендуемая структура:

```text
src/entities/listing/ui/listing-media-gallery.tsx
src/entities/listing/ui/listing-card-media-gallery.tsx
src/entities/listing/ui/listing-details-media-gallery.tsx
src/entities/listing/ui/listing-media-preview-dialog.tsx
src/entities/listing/ui/listing-media-thumbnails.tsx
src/entities/listing/ui/listing-media-upload-grid.tsx
src/entities/listing/lib/normalize-listing-images.ts
```

Ожидаемый результат:

- публичный `ListingMediaGallery` может остаться facade;
- modal logic отделяется;
- upload grid не смешивается с display gallery.

### `about-page.tsx`

Проблема: файл большой, но скорее статический/маркетинговый.

Решение: не трогать первым. Разделять только если:

- туда добавятся данные с API;
- появятся интерактивные блоки;
- страница начнет часто меняться.

### `listings-page.tsx`

Проблема: личный список объявлений похож на public feed, но с owner actions и selection.

Рекомендуемая структура:

```text
src/screens/account/listings/model/use-owned-listings.ts
src/screens/account/listings/ui/listings-page.tsx
src/screens/account/listings/ui/listings-toolbar.tsx
src/screens/account/listings/ui/listings-grid.tsx
src/screens/account/listings/ui/listings-empty-state.tsx
```

### `HeaderSessionActions.tsx`

Проблема: header actions могут смешивать auth state, notifications, theme/settings dropdown и create listing shortcut.

Рекомендуемая структура:

```text
src/widgets/header/ui/HeaderSessionActions.tsx
src/widgets/header/ui/HeaderNotificationsButton.tsx
src/widgets/header/ui/HeaderAccountDropdown.tsx
src/widgets/header/ui/HeaderGuestActions.tsx
```

## Приоритет рефакторинга

### Первая очередь

1. `listing-card.tsx`
2. `listing-details-page.tsx`
3. `profile-addresses-section.tsx`
4. `api-schemas.ts`

Причина: эти файлы чаще всего будут меняться при развитии продукта.

### Вторая очередь

1. `public-listings-page.tsx` - выполнено 01.07.2026.
2. `home-page.tsx` - выполнено 01.07.2026.
3. `listing-media-gallery.tsx` - выполнено 01.07.2026.
4. `blog-detail-page.tsx` - выполнено 01.07.2026.

Причина: важно, но лучше делать после стабилизации общих listing helpers.

### Третья очередь

1. `about-page.tsx`
2. `listings-page.tsx`
3. `HeaderSessionActions.tsx`

Причина: можно трогать по мере появления задач рядом с этими зонами.

## Правило для будущих PR

Если файл превышает лимит, в PR нужно одно из двух:

- декомпозировать файл;
- явно указать причину, почему файл временно остается крупным.

Пример допустимой причины:

```text
Файл остается 320 строк, потому что это статическая маркетинговая страница без state и API. Декомпозиция запланирована при следующем изменении блока hero/metrics.
```
