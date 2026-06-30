# Чеклист релиза frontend

## Проверки

```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

## API-совместимость

Перед релизом проверь:

- backend уже содержит нужные endpoints;
- frontend Zod schemas совпадают с backend DTO;
- private pages корректно обрабатывают `401` и `419`;
- публичные страницы не требуют auth;
- image hostnames настроены в `next.config`.

## Ручной smoke

- Главная страница открывается.
- Каталог открывается.
- Поиск в header не ломает layout.
- Sign in/sign up работают.
- Account dropdown отображается корректно.
- Создание объявления открывается только для авторизованного пользователя.
- Редактирование объявления подставляет категории, адрес и медиа.
- Карточки объявлений кликабельны.
- Избранное работает.
- Настройки уведомлений загружаются.
- Логотип корректен в светлой и темной теме.

## Перед push

```bash
git status --short
git diff --check
```

Рекомендуемое сообщение:

```text
docs(): add frontend handbook
```
