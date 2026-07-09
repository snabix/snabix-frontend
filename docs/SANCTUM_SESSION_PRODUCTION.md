# Чеклист Sanctum-сессий для production

Frontend использует cookie-based session flow через Laravel Sanctum. Это удобно для SPA, но в production работает корректно только при согласованной настройке frontend, backend, CORS и cookie-доменов.

## Клиентское приложение

- `NEXT_PUBLIC_API_URL` или аналогичная переменная должна указывать на API backend, например `https://api.snabix.ru/api/v1`.
- Frontend берет CSRF cookie с origin этой переменной: для примера выше это `https://api.snabix.ru/sanctum/csrf-cookie`.
- Запросы выполняются с credentials, поэтому backend обязан разрешать credentials.
- При `401` или `419` frontend очищает локальное состояние пользователя.
- Приватные страницы должны мягко отправлять пользователя на вход без технических сообщений про CSRF или token mismatch.

## Backend-сервис

- `FRONTEND_URL` должен указывать на основной frontend origin, например `https://app.snabix.ru`.
- `FRONTEND_URLS` должен содержать все разрешенные frontend origins через запятую, если есть несколько доменов, например `https://app.snabix.ru,https://admin.snabix.ru`.
- `SANCTUM_STATEFUL_DOMAINS` должен включать frontend-домены без протокола.
- `SESSION_DOMAIN` должен подходить под frontend/backend домены, если они находятся на поддоменах одного домена.
- `SESSION_SECURE_COOKIE=true` обязателен для HTTPS.
- `SESSION_SAME_SITE=lax` обычно подходит для same-site поддоменов.
- Для cross-site сценариев нужна отдельная проверка cookie policy.
- CORS должен разрешать frontend origin и credentials.

## Пример same-site поддоменов

```env
# frontend
NEXT_PUBLIC_API_URL=https://api.snabix.ru/api/v1

# backend
APP_URL=https://api.snabix.ru
FRONTEND_URL=https://app.snabix.ru
FRONTEND_URLS=https://app.snabix.ru
SANCTUM_STATEFUL_DOMAINS=app.snabix.ru
SESSION_DOMAIN=.snabix.ru
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax
```

Если frontend и backend находятся на разных site, например разные eTLD+1, `SESSION_SAME_SITE=lax` уже недостаточно для cookie session flow. Такой сценарий нужно отдельно проверять с `SESSION_SAME_SITE=none`, `SESSION_SECURE_COOKIE=true` и актуальной browser cookie policy.

## Staging smoke

Перед production-релизом проверь на staging-доменах:

1. Открой frontend staging URL и очисти cookies для frontend/backend доменов.
2. Выполни sign-in.
3. В Network проверь порядок:
   - `GET https://<api-origin>/sanctum/csrf-cookie` возвращает `204`;
   - unsafe auth request, например `POST https://<api-origin>/api/v1/auth/sign-in`, уходит с `credentials` и заголовком `X-XSRF-TOKEN`;
   - ответ sign-in успешный, пользователь видит авторизованное состояние.
4. В Application cookies проверь:
   - `XSRF-TOKEN` доступен JavaScript на API/site domain;
   - session cookie `HttpOnly`;
   - `Domain` совпадает с выбранной схемой поддоменов;
   - `Secure=true` на HTTPS;
   - `SameSite=Lax` для same-site поддоменов или `None` только для cross-site схемы.
5. Обнови страницу на приватном маршруте, например `/account/profile`: пользователь остается авторизованным.
6. Выполни unsafe request после refresh, например изменение настройки профиля или favorite/listing mutation: запрос проходит без `CSRF token mismatch`.
7. Принудительно проверь `401`: удали session cookie и сделай приватный запрос. UI должен отправить на sign-in без технического текста.
8. Принудительно проверь `419`: оставь session cookie, удали/искази `XSRF-TOKEN`, затем выполни unsafe request. UI должен отправить на sign-in с тем же дружелюбным UX.
9. Повтори smoke для каждого origin из `FRONTEND_URLS`.

## UX-правило

Пользователю не показываем технические сообщения:

- `CSRF token mismatch`;
- `session expired`;
- `token expired`;
- `unauthorized`.

Если приватная сессия больше не действует, интерфейс предлагает снова войти в аккаунт понятным пользовательским текстом.
