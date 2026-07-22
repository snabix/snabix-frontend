# Стандарт тестирования frontend

## Unit и integration тесты

Unit и integration тесты хранятся рядом с кодом, который они защищают:

- `src/features/**/model/*.test.ts`
- `src/features/**/ui/*.test.tsx`
- `src/entities/**/model/*.test.ts`
- `src/shared/**/**/*.test.ts`

Это соответствует текущей Feature-Sliced структуре: slice владеет model, UI, API adapter и тестами вместе. Если фича переносится, тесты переносятся вместе с ней.

Межслойные API contract tests хранятся в `tests/contracts/**`. Они проверяют
совместную работу `shared` schemas и adapters из `entities/features`, поэтому не
должны создавать обратные зависимости внутри нижнего FSD-слоя.

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

Critical E2E для локального pre-push:

```bash
npm run test:e2e:critical
```

Полный E2E для CI и релизной проверки:

```bash
npm run test:e2e:full
```

## Accessibility auth/profile

`tests/e2e/auth-accessibility.spec.ts` проверяет auth и profile flows в реальном
Chromium:

- axe-core не находит нарушений с impact `critical`;
- sign-in полностью выполняется клавиатурой;
- validation error получает `role="alert"`, а поле связано с ним через
  `aria-errormessage` и `aria-describedby`;
- email и password inputs имеют ожидаемые `type` и `autocomplete`;
- privacy и email verification dialogs переводят фокус внутрь, удерживают его
  средствами Radix Dialog и возвращают на открывшую кнопку.

Матрица password-manager semantics:

| Flow | Identifier | Secret |
| --- | --- | --- |
| Sign in | `type=email`, `autocomplete=username` | `current-password` |
| Sign up | `type=email`, `autocomplete=username` | `new-password` |
| Forgot password | `type=email`, `autocomplete=email` | - |
| Reset password | `type=email`, `autocomplete=username` | `new-password` |
| Change password | - | `current-password`, затем `new-password` |
| Email verification | - | `one-time-code` |

Эта матрица следует
[WHATWG HTML autofill contract](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill).
ARIA-связи полей соответствуют
[WAI Forms Tutorial](https://www.w3.org/WAI/tutorials/forms/), а управление
фокусом -
[WAI Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
Не ставь `autocomplete="off"` на auth/profile form: это ломает сохранение и
заполнение учетных данных браузером и внешними password managers.

Запуск только accessibility-контракта:

```bash
npx playwright test tests/e2e/auth-accessibility.spec.ts --workers=1
```

Контракт backend/frontend:

```bash
npm run contracts:check
```

Команда проверяет versioned listing snapshot существующими Zod adapters и
обязательную public/private privacy boundary. Полный процесс синхронизации
описан в `docs/API_CONTRACTS.md`.

Полная frontend-проверка:

```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e:full
```
