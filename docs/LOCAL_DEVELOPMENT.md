# Локальная разработка frontend

Документ описывает запуск и проверку `snabix-frontend`.

## Первый запуск

```bash
cd $PROJECT_ROOT/snabix-frontend
npm install
npm run dev
```

Адрес:

```text
http://localhost:3000
```

Backend должен быть доступен на:

```text
http://localhost:8080/api/v1
```

## Node и npm

Единый policy проекта:

```text
node >=22 <23
npm >=10 <12
```

Рекомендуемая локальная версия Node берется из `.nvmrc`, CI использует тот же файл.
Рекомендуемая версия npm закреплена в `packageManager` и CI:

```text
npm 10.9.0
```

Подготовка и проверка:

```bash
nvm install
nvm use
npm install -g npm@10.9.0
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
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
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
APP_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:3001,127.0.0.1:3000,127.0.0.1:3001
```

Если frontend получает `401` или `419`, проверь:

- cookies в браузере;
- CSRF flow;
- `SANCTUM_STATEFUL_DOMAINS`;
- `SESSION_DOMAIN`;
- API base URL;
- что frontend и API используют один hostname. Для локальной разработки открывай frontend на `http://localhost:3000` и указывай API как `http://localhost:8080/api/v1`, либо используй `127.0.0.1` в обоих местах.

## Частые проблемы

### `.next` занимает слишком много места

Можно удалить build cache:

```bash
rm -rf .next
```

После этого `npm run dev` или `npm run build` создаст директорию заново.

### Next Image ругается на hostname

Если backend отдает картинки с `localhost:8080` или `127.0.0.1:8080`, hostname должен быть разрешен в `next.config`.

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

Production container smoke:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1 \
  --build-arg APP_REVISION=local \
  -t snabix-frontend:local .
```
