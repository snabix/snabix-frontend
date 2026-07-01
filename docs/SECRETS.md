# Секреты frontend

Frontend работает в браузере, поэтому все переменные с префиксом `NEXT_PUBLIC_` считаются публичными.

## Главное правило

Во frontend нельзя хранить:

- backend service token;
- Telegram bot token;
- SMTP credentials;
- database credentials;
- приватные ключи;
- production secrets.

## Что можно хранить

Разрешены публичные настройки:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8080/api/v1
```

Если значение попадает в browser bundle, его может увидеть пользователь.

## Локальные файлы

Обычно используется:

```text
.env.local
```

Он не должен попадать в git.

## Auth

Frontend не хранит пароль пользователя или access token вручную. Auth работает через Laravel Sanctum и cookies.

При истечении сессии frontend должен:

- очистить user store;
- показать корректное состояние UI;
- отправить пользователя на вход, если страница приватная.

## Проверка перед коммитом

```bash
git diff --cached
```

Ищи:

- `TOKEN`;
- `PASSWORD`;
- `SECRET`;
- реальные SMTP/DB значения;
- приватные URL с credentials.
