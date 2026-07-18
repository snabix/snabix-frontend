# Чеклист релиза frontend

## Проверки

```bash
npm run audit:prod
npm run typecheck
npm run lint
npm run test
npm run test:e2e:full
npm run build
```

Production image собирается как Next standalone runtime и запускается
непривилегированным пользователем. `NEXT_PUBLIC_API_URL` встраивается на этапе
build, поэтому один image нельзя продвигать между окружениями с разными API URL.
После публикации зафиксируй `sha-*` tag или OCI digest, не используй `latest`.

Readiness:

```text
GET /api/health
```

Endpoint должен вернуть `200`, `Cache-Control: no-store` и revision образа.

Production audit должен завершаться без high/critical advisories. Допустимое временное исключение для low/moderate оформляется с advisory ID, оценкой применимости, компенсирующими мерами, владельцем и сроком повторной проверки; `npm audit fix --force` для релизной ветки не используется.

### Активное audit-исключение

- Advisory: `GHSA-qx2v-qp2m-jg93`, moderate; npm показывает две записи через `next` и его `postcss`, но это одна исходная уязвимость.
- Причина: Next `16.2.10` фиксирует внутренний PostCSS на `8.4.31`; автоматический fix предлагает несовместимый откат Next до `9.3.3`.
- Применимость: приложение не импортирует PostCSS напрямую и не принимает пользовательский CSS для сериализации; пакет обрабатывает только контролируемые репозиторием стили во время сборки.
- Компенсирующие меры: точный lock-файл, CI блокирует high/critical, `overrides` и `npm audit fix --force` запрещены до поддержанного обновления Next.
- Владелец: frontend maintainers. Пересмотреть при следующем обновлении Next или не позднее 2026-08-16.

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
- Auth-формы предлагают browser/password-manager autofill для email и пароля.
- Sign in и редактирование email в настройках выполняются только клавиатурой.
- При открытии privacy/verification dialog фокус находится внутри модального
  окна, `Escape` закрывает его и возвращает фокус на исходную кнопку.
- `tests/e2e/auth-accessibility.spec.ts` проходит без critical axe violations.

## Performance Budget Public Listings

Перед релизом зафиксируй значения для публичной витрины объявлений на staging:

- TTFB `/` или страницы категории: не выше 500 ms.
- LCP на mobile profile: не выше 2.5 s.
- First-load JS для публичной витрины: не выше 250 KB gzip.
- Количество API-запросов при первом открытии: не больше 4.
- Backend query count для списка объявлений: не больше 12 запросов.

Автоматизированный browser замер запускается против HTTPS staging:

```bash
PUBLIC_STOREFRONT_URL=https://staging.example.com/ npm run performance:public
```

Команда использует mobile profile и завершится с ошибкой при превышении TTFB,
LCP, first-load JS или browser API request budget. Server Components выполняют
два серверных запроса на первом открытии главной (категории и объявления);
`public-storefront-ssr.spec.ts` отдельно гарантирует отсутствие повторного
browser-запроса списка после hydration. Backend query budget фиксируется
feature-тестом public listing query.

Если бюджет превышен, релиз можно продолжить только с коротким комментарием причины,
ссылкой на задачу оптимизации и владельцем исправления.

## Перед push

```bash
git status --short
git diff --check
npm run test:e2e:critical
```

Рекомендуемое сообщение:

```text
docs(): add frontend handbook
```
