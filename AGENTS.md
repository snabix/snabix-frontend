<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Про проект

`Snabix Frontend` построен на `Next.js App Router`, `React`, `TypeScript`, `Tailwind CSS`, `shadcn/Radix`, `Zustand`, `axios`, `zod`, `react-hook-form` и `Vitest`.

Проект - frontend регионального marketplace для товаров и услуг. Главные продуктовые зоны: публичная главная/каталог, авторизация, личный кабинет, профиль, объявления, категории и будущая модерация/медиа.

## Архитектура

Следуй Feature-Sliced Design:

- `src/app` отвечает за роутинг, route layouts/pages и metadata.
- `src/screens` собирает страницы из widgets/features/entities.
- `src/widgets` содержит крупные переиспользуемые блоки: layout, header, footer, account shell.
- `src/features` содержит пользовательские действия: auth, profile update, avatar upload, listing create/update.
- `src/entities` содержит бизнес-сущности: user, category, listing.
- `src/shared` содержит API-клиент, UI-kit, config, utils и базовые стили.

Не смешивай API-запросы, состояние формы и крупную верстку в одном компоненте. Если компонент растет, выноси state/hook/model отдельно.

## UI

- Основной UI-kit: shadcn/Radix components в `src/shared/ui/shadcn`.
- Ant Design не используется и не должен возвращаться без отдельного решения.
- Палитра проекта: OAT `#FFF0E1` и INDIGO `#C8C3FF` через CSS variables.
- Не добавляй случайные hardcoded цвета, если можно использовать существующие CSS variables.
- Все интерактивные действия должны иметь понятные hover/focus/disabled/loading states.
- Для destructive actions используй подтверждающий dialog, а не `window.confirm`, когда это часть пользовательского flow.

## API И Сессия

- Все backend-запросы идут через `src/shared/api`.
- Axios должен работать с cookie/Sanctum: `withCredentials`, `withXSRFToken`, CSRF-cookie перед unsafe methods.
- При `401` и `419` очищай локальное session state и используй единый auth-event flow.
- Не доверяй backend response shape напрямую в UI. Используй API adapters, unwrap/mappers и типы.
- Backend lists API для объявлений использует контракт `data.items` + `data.meta`; frontend adapters должны учитывать пагинацию.

## Auth

- Закрытые account routes должны идти через единый `AuthGuard`.
- Registration flow не должен зависеть от автоматического логина после `sign-up`.
- При добавлении нового auth endpoint добавляй тест хотя бы на adapter/session behavior.
- Change password endpoint backend уже существует и должен подключаться через отдельную feature.

## Listings

- Create listing: `saveAsDraft` используется только для создания черновика.
- Update listing не должен использовать `saveAsDraft`; для update нужен отдельный `UpdateListingPayload`.
- Отправка черновика на проверку должна идти через отдельный endpoint `submit-for-review`.
- Public listing DTO не содержит приватные owner/contact поля.
- Money values на frontend принимаются как целые числа без копеек.
- Category attributes используют string keys во frontend-state и mapper payload.

## Тесты

- Для новых API adapters, форм и session behavior добавляй Vitest/Testing Library tests.
- Перед завершением frontend-задачи проверяй `npm run lint`, `npm run test`, `npm run build`, если изменение влияет на сборку или типизацию.
- В будущем тесты стоит вынести в отдельную директорию `tests/unit`, `tests/integration`, `tests/e2e`, если команда принимает это как стандарт.

## Размер файлов и декомпозиция

- UI-компоненты и страницы: целевой размер до 250 строк, жесткая граница 300 строк.
- Hooks и model-файлы с состоянием: не более 250 строк.
- API schemas, contracts и adapters: не более 300 строк.
- Остальные production-файлы TypeScript/TSX: не более 300 строк.
- Test specs и fixtures: целевой размер до 300 строк; превышение допустимо до 400 строк только для цельного сценария или набора контрактных данных.
- Generated-файлы и lock-файлы не учитываются.
- Новый файл выше границы не принимается без декомпозиции. Существующий legacy-файл выше границы нельзя увеличивать: при изменении его нужно уменьшить либо зафиксировать временное обоснование и отдельную задачу на разбиение в PR или техническом аудите.

## Что Проверять Перед Завершением

- Новая страница подключена через App Router корректно.
- Client component помечен `"use client"` только когда реально нужен state/effect/browser API.
- API adapter синхронизирован с backend DTO.
- Loading, empty, error и success states не забыты.
- Mobile layout не получает горизонтальный scroll.
- Auth/account сценарий не раскрывает приватные данные до проверки сессии.
