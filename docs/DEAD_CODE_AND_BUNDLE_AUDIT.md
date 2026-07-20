# Dead Code And Bundle Audit

Дата проверки: 2026-07-20.

## Scope

Проверены production imports, `package.json`, `package-lock.json`, client chunks
production build и упоминания browser access token в документации.

Удалено:

- неиспользуемый `shared/lib/access-token.ts`, противоречивший Sanctum cookie flow;
- неиспользуемые `bannerSlides` и фальшивые числовые метрики главной страницы;
- production-модуль `fallback-posts.ts`; минимальная запись перенесена в
  `tests/fixtures/blog-post.ts`;
- прямые зависимости `@fiddle-digital/string-tune`,
  `embla-carousel-react` и `framer-motion`.

Статический контент главной перенесен из `mock-data.ts` в предметный
`screens/home/model/home-content.ts`. Единственная Framer Motion анимация
переключателя темы заменена CSS transitions с `motion-reduce`.

## Dependency Evidence

До изменений `npm ls` показывал три прямые runtime-зависимости. Поиск production
imports не нашел использования String Tune и Embla. Framer Motion импортировался
только `ThemeSwitcher`, который входит в общий layout.

После изменений:

```bash
npm ls @fiddle-digital/string-tune embla-carousel-react framer-motion --all
```

не возвращает эти пакеты, а lock-файл больше не содержит Embla, Framer Motion,
`motion-dom` и `motion-utils`.

## Bundle Comparison

Измерение выполняется после `npm run build`:

```bash
npm run bundle:report
```

Скрипт читает client reference manifest маршрута `/` и суммирует raw/gzip размеры
JS chunks общего `src/app/layout`.

| Метрика | До | После | Разница |
|---------|---:|------:|--------:|
| Layout client chunks | 10 | 9 | -1 |
| Raw JS | 791 089 B | 667 238 B | -123 851 B (-15,7%) |
| Gzip JS | 221 463 B | 180 352 B | -41 111 B (-18,6%) |

До изменений Motion runtime находился в отдельном chunk размером `131 351 B`
raw / `43 365 B` gzip. После CSS-замены этот chunk отсутствует.

## Auth Storage

Auth использует Laravel Sanctum, CSRF cookie и серверную session cookie.
Frontend не сохраняет access token в `localStorage`, `sessionStorage` или другом
доступном JavaScript хранилище. Legal copy и `docs/SECRETS.md` отражают этот flow.
