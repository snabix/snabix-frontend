# Чеклист Sanctum-сессий для production

Frontend использует cookie-based session flow через Laravel Sanctum. Это удобно для SPA, но в production работает корректно только при согласованной настройке frontend, backend, CORS и cookie-доменов.

## Клиентское приложение

- `NEXT_PUBLIC_API_URL` должна указывать на API backend, например `https://api.snabix.ru/api/v1`.
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

## Матрица окружений

Фактические staging-значения фиксируются без секретов в
`$PROJECT_ROOT/snabix-backend/.docs/STAGING_AUTH_SMOKE_REPORT.md`.

| Параметр | Local | HTTPS staging | Production |
|---|---|---|---|
| Frontend origin | `http://localhost:3000` | `https://<staging-frontend-host>` | `https://<frontend-host>` |
| API origin | `http://127.0.0.1:8080` | `https://<staging-api-host>` | `https://<api-host>` |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api/v1` | `https://<staging-api-host>/api/v1` | `https://<api-host>/api/v1` |
| `APP_URL` | `http://127.0.0.1:8080` | API origin | API origin |
| `FRONTEND_URL` | Frontend origin | Frontend origin | Frontend origin |
| `FRONTEND_URLS` | Разрешенные local origins | Точный список staging origins | Точный список production origins |
| `SANCTUM_STATEFUL_DOMAINS` | Frontend hosts с портами | Frontend hosts без протокола | Frontend hosts без протокола |
| `SESSION_DRIVER` | `database` | `database` | `database` |
| `SESSION_DOMAIN` | Пустое значение допустимо | Общий parent domain для поддоменов | Общий parent domain для поддоменов |
| `SESSION_SECURE_COOKIE` | `false` для HTTP | `true` | `true` |
| `SESSION_HTTP_ONLY` | `true` | `true` | `true` |
| `SESSION_SAME_SITE` | `lax` | `lax` для same-site | `lax` для same-site |
| `FRONTEND_RESET_PASSWORD_URL` | `${FRONTEND_URL}/reset-password` | `${FRONTEND_URL}/reset-password` | `${FRONTEND_URL}/reset-password` |

`FRONTEND_URLS` и CORS должны перечислять только реальные origins с протоколом.
`SANCTUM_STATEFUL_DOMAINS` принимает hosts без протокола, но с портом, если он
используется. Wildcard origins при `supports_credentials=true` не применяются.

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
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
FRONTEND_RESET_PASSWORD_URL=${FRONTEND_URL}/reset-password
```

Если frontend и backend находятся на разных site, например разные eTLD+1, `SESSION_SAME_SITE=lax` уже недостаточно для cookie session flow. Такой сценарий нужно отдельно проверять с `SESSION_SAME_SITE=none`, `SESSION_SECURE_COOKIE=true` и актуальной browser cookie policy.

## Ожидаемые cookie attributes

| Cookie | Domain | Path | Secure | HttpOnly | SameSite |
|---|---|---|---|---|---|
| `XSRF-TOKEN` | Общий parent domain или API host согласно схеме | `/` | `true` | `false` | `Lax` для same-site |
| Laravel session cookie | Общий parent domain или API host согласно схеме | `/` | `true` | `true` | `Lax` для same-site |

Имена и значения cookie, reset token, пароль и содержимое `X-XSRF-TOKEN`
никогда не прикладываются к отчету. Достаточно записать attributes, HTTP status,
время проверки и ссылку на защищенный CI/deploy run.

## Политика жизненного цикла сессий

- `SESSION_LIFETIME=43200` задает rolling idle lifetime в 30 дней. Это
  осознанный UX-компромисс, а не абсолютный срок жизни сессии.
- При смене пароля текущая сессия получает новый ID и CSRF token, остальные
  database sessions пользователя удаляются.
- При восстановлении пароля по email удаляются все database sessions и
  обновляется `remember_token`; после reset пользователь входит заново.
- Logout завершает текущую сессию, а экран активных сессий позволяет завершить
  отдельное устройство или все остальные устройства.

Длительная сессия допустима только вместе с `Secure`, `HttpOnly`, корректным
`SameSite`, HTTPS, возможностью ручного отзыва и проверенным password-revocation
flow. Абсолютный максимальный срок сессии пока не реализован и должен
рассматриваться отдельным security-решением.

## Staging smoke

Перед production-релизом проверь на staging-доменах:

1. Заполни фактические frontend/API origins в staging smoke report.
2. Открой frontend staging URL и очисти cookies для frontend/backend доменов.
3. Создай отдельного staging-пользователя и подтверди sign-up.
4. Выполни sign-in.
5. В Network проверь порядок:
   - `GET https://<api-origin>/sanctum/csrf-cookie` возвращает `204`;
   - unsafe auth request, например `POST https://<api-origin>/api/v1/auth/sign-in`, уходит с `credentials` и заголовком `X-XSRF-TOKEN`;
   - ответ sign-in успешный, пользователь видит авторизованное состояние.
6. В Application cookies проверь:
   - `XSRF-TOKEN` доступен JavaScript на API/site domain;
   - session cookie `HttpOnly`;
   - `Domain` совпадает с выбранной схемой поддоменов;
   - `Secure=true` на HTTPS;
   - `SameSite=Lax` для same-site поддоменов или `None` только для cross-site схемы.
7. Обнови страницу на приватном маршруте, например `/account/profile`:
   пользователь остается авторизованным.
8. Выполни unsafe request после refresh, например изменение профиля: запрос
   проходит без `CSRF token mismatch`.
9. Открой вторую сессию в другом browser context и заверши ее через экран
   активных сессий. Первая сессия продолжает работать, вторая получает `401`.
10. Снова открой две сессии и смени пароль в первой. Первая сессия продолжает
    работать с новым session ID, вторая получает `401`, старый пароль не
    подходит.
11. Запроси reset password. Ссылка из письма открывает frontend route
    `/reset-password`, reset завершается, после него обе старые сессии получают
    `401`, а вход работает только с новым паролем.
12. Выполни logout и подтверди, что приватный запрос получает `401`.
13. Принудительно проверь `401`: удали session cookie и сделай приватный запрос.
    UI отправляет на sign-in без технического текста.
14. Принудительно проверь `419`: оставь session cookie, удали или искази
    `XSRF-TOKEN`, затем выполни unsafe request. UI отправляет на sign-in с тем
    же дружелюбным UX.
15. Повтори smoke для каждого origin из `FRONTEND_URLS`.

Результаты каждого пункта переносятся в staging smoke report. Задача не может
считаться выполненной только по unit/feature-тестам или локальному HTTP smoke.

## UX-правило

Пользователю не показываем технические сообщения:

- `CSRF token mismatch`;
- `session expired`;
- `token expired`;
- `unauthorized`.

Если приватная сессия больше не действует, интерфейс предлагает снова войти в аккаунт понятным пользовательским текстом.
