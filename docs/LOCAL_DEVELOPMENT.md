# Локальная разработка frontend

Документ описывает запуск и проверку `snabix-frontend`.

## Первый запуск

```bash
cd /Users/imranpskhu/projects/snabix/snabix-frontend
npm install
npm run dev
```

Адрес:

```text
http://127.0.0.1:3000
```

Backend должен быть доступен на:

```text
http://127.0.0.1:8080/api/v1
```

## Node и npm

В проекте закреплены версии:

```text
node >=22 <23
npm >=11 <12
```

Проверка:

```bash
node -v
npm -v
```

## Переменные окружения

Локальный файл:

```text
.env.local
```

В браузер можно передавать только публичные переменные. Не добавляй backend service token или Telegram token во frontend env.

Пример:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8080/api/v1
```

## Ежедневная работа

```bash
npm run dev
npm run typecheck
npm run lint
npm run test
```

E2E:

```bash
npx playwright install chromium
npm run test:e2e
```

## Интеграция с backend

Для корректной работы auth/cookies backend должен иметь:

```env
APP_URL=http://127.0.0.1:8080
FRONTEND_URL=http://127.0.0.1:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
```

Если frontend получает `401` или `419`, проверь:

- cookies в браузере;
- CSRF flow;
- `SANCTUM_STATEFUL_DOMAINS`;
- `SESSION_DOMAIN`;
- API base URL.

## Частые проблемы

### `.next` занимает слишком много места

Можно удалить build cache:

```bash
rm -rf .next
```

После этого `npm run dev` или `npm run build` создаст директорию заново.

### Next Image ругается на hostname

Если backend отдает картинки с `127.0.0.1:8080`, hostname должен быть разрешен в `next.config`.

### Не совпадает DTO

Если backend изменил response, обнови:

- API adapter;
- Zod schema;
- TypeScript type;
- тесты.

## Перед коммитом

```bash
npm run typecheck
npm run lint
npm run test
git diff --check
```

Для больших UI-изменений дополнительно:

```bash
npm run test:e2e
npm run build
```
