# Стандарт тестирования frontend

## Unit и integration тесты

Unit и integration тесты хранятся рядом с кодом, который они защищают:

- `src/features/**/model/*.test.ts`
- `src/features/**/ui/*.test.tsx`
- `src/entities/**/model/*.test.ts`
- `src/shared/**/**/*.test.ts`

Это соответствует текущей Feature-Sliced структуре: slice владеет model, UI, API adapter и тестами вместе. Если фича переносится, тесты переносятся вместе с ней.

## Browser и E2E тесты

Browser-level smoke и E2E тесты хранятся отдельно:

```text
tests/e2e/**
```

Этот уровень нужен только для реальных браузерных сценариев:

- авторизация;
- навигация профиля;
- карточки объявлений;
- mobile header/footer;
- account sidebar;
- session expiration.

Component-like тесты не нужно переносить в `tests/e2e`.

## Команды

Unit и integration:

```bash
npm run test
```

E2E:

```bash
npx playwright install chromium
npm run test:e2e
```

Полная frontend-проверка:

```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e
```
