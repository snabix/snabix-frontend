# Чеклист Sanctum-сессий для production

Frontend использует cookie-based session flow через Laravel Sanctum. Это удобно для SPA, но в production работает корректно только при согласованной настройке frontend, backend, CORS и cookie-доменов.

## Клиентское приложение

- `NEXT_PUBLIC_API_URL` или аналогичная переменная должна указывать на API backend, например `https://api.snabix.ru/api/v1`.
- Запросы выполняются с credentials, поэтому backend обязан разрешать credentials.
- При `401` или `419` frontend очищает локальное состояние пользователя.
- Приватные страницы должны мягко отправлять пользователя на вход без технических сообщений про CSRF или token mismatch.

## Backend-сервис

- `SANCTUM_STATEFUL_DOMAINS` должен включать frontend-домены без протокола.
- `SESSION_DOMAIN` должен подходить под frontend/backend домены, если они находятся на поддоменах одного домена.
- `SESSION_SECURE_COOKIE=true` обязателен для HTTPS.
- `SESSION_SAME_SITE=lax` обычно подходит для same-site поддоменов.
- Для cross-site сценариев нужна отдельная проверка cookie policy.
- CORS должен разрешать frontend origin и credentials.

## UX-правило

Пользователю не показываем технические сообщения:

- `CSRF token mismatch`;
- `session expired`;
- `token expired`;
- `unauthorized`.

Если приватная сессия больше не действует, интерфейс предлагает снова войти в аккаунт понятным пользовательским текстом.
