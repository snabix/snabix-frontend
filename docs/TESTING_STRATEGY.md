# Стратегия тестирования frontend

Frontend-тесты проверяют UI-состояния, формы, contracts parsing и пользовательские сценарии.

## Проверки

```bash
cd $PROJECT_ROOT/snabix-frontend
npm run typecheck
npm run lint
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
