# Стратегия тестирования frontend

Frontend-тесты проверяют UI-состояния, формы, contracts parsing и пользовательские сценарии.

## Проверки

```bash
cd $PROJECT_ROOT/snabix-frontend
npm run typecheck
npm run lint
npm run architecture:client
npm run test
npm run test:e2e:full
```

## Unit и integration

Vitest используется для:

- form schema;
- attribute values;
- listing money formatting;
- session provider;
- auth guard;
- favorite listings hook;
- listing form integration.

Запуск:

```bash
npm run test
```

## E2E

Playwright используется для full user flow:

- auth;
- marketplace;
- listing management;
- profile addresses;
- session expiration.

Запуск:

```bash
npx playwright install chromium
npm run test:e2e:full
```

Часть e2e использует deterministic API mocks. Поведение Laravel API покрывается backend feature-тестами.

`tests/e2e/public-storefront-ssr.spec.ts` запускается с отдельным deterministic
HTTP fixture для Server Components. Набор проверяет HTML без JavaScript,
metadata/OG, отсутствие hydration-запроса списка и то, что browser cookie не
передается server API client как состояние избранного.

`tests/e2e/theme-hydration.spec.ts` проверяет `light`, `dark` и `system`,
собирает browser console/page errors и запрещает hydration/script warnings.
System-сценарий дополнительно меняет `prefers-color-scheme` после hydration.

`npm run architecture:client` контролирует максимальное количество явных
`"use client"` entry points и запрещает обычные callback props с суффиксом
`Action`. Команда входит в `npm run lint`.

## Local hooks и CI

Локальный `pre-commit` запускает быстрые проверки: lint, typecheck и unit/integration tests.

Локальный `pre-push` запускает strict-набор без полного параллельного e2e:

```bash
npm run lint
npm run typecheck
npm run typecheck:full
npm run test
npm run test:e2e:critical
```

Полный e2e-набор запускается в GitHub Actions через `npm run test:e2e:full`. Это снижает локальные flaky-timeout при push, но сохраняет полный browser coverage как обязательный CI-gate.

Если локально уже запущен Next dev server, для изолированного e2e можно задать
другие порты и build directory:

```bash
E2E_PORT=3011 E2E_API_PORT=4021 E2E_DIST_DIR=.next-e2e-3011 npm run test:e2e:full
```

## Что обязательно тестировать

Добавляй тест, если меняется:

- private route behavior;
- обработка `401` или `419`;
- форма создания/редактирования объявления;
- media upload/reorder/main image UI;
- favorites;
- notification settings;
- API schema parsing;
- header/account dropdown;
- theme/logo behavior.

## Контракт с backend

Если backend DTO изменился:

1. Обнови Zod schema.
2. Обнови TypeScript type.
3. Обнови API adapter.
4. Обнови unit/integration тест.
5. При необходимости обнови e2e fixture.

## Ручной smoke

После больших UI-изменений проверь:

- главную страницу;
- каталог;
- публичную детальную страницу;
- вход;
- личные объявления;
- создание объявления;
- редактирование объявления;
- избранное;
- настройки уведомлений;
- смену темы;
- mobile layout.
