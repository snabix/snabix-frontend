# Sanctum/session production checklist

Frontend использует cookie-based session flow через Laravel Sanctum. Это удобно для SPA, но в production оно работает корректно только при согласованной настройке frontend, backend, CORS и cookie-доменов.

## Frontend

- `NEXT_PUBLIC_API_URL` должен указывать на API backend, например `https://api.snabix.ru/api/v1`.
- Frontend-запросы выполняются с `withCredentials: true`, поэтому backend обязан разрешать credentials.
- При `401/419` frontend очищает локальное состояние пользователя и мягко переводит приватные страницы на вход без технического текста про токены или CSRF.

## Backend

- `SANCTUM_STATEFUL_DOMAINS` должен включать frontend-домены без протокола.
- `SESSION_DOMAIN` должен подходить под frontend/backend домены, если они живут на поддоменах одного домена.
- `SESSION_SECURE_COOKIE=true` обязателен для HTTPS.
- `SESSION_SAME_SITE=lax` обычно достаточно для same-site поддоменов; для cross-site сценариев нужна отдельная проверка cookie policy.
- CORS должен разрешать frontend origin и `supports_credentials=true`.

## UX policy

Пользователю не показываем технические сообщения вроде “CSRF token mismatch” или “session expired”. Если приватная сессия больше не действует, интерфейс предлагает продолжить через вход в аккаунт понятным пользовательским текстом.
