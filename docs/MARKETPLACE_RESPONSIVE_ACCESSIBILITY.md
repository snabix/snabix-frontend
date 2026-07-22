# Responsive и accessibility baseline marketplace

Дата baseline: 2026-07-22.

Документ фиксирует визуальные и accessibility-инварианты публичной витрины.
Это release gate для главной, общего списка объявлений и детальной страницы.

## Матрица

| Viewport | Назначение |
| --- | --- |
| 360 x 800 | минимальная поддерживаемая ширина мобильного устройства |
| 390 x 844 | основной мобильный viewport |
| 768 x 1024 | планшет и переход между mobile/desktop layout |
| 1440 x 900 | основной desktop viewport |

В светлой и темной теме на каждом viewport проверяются главная `/`, витрина категории
`/?categoryId=1` и `/listings/listing-1` с deterministic API fixture. Скриншот первого экрана
каждой комбинации прикладывается к Playwright HTML report.

## UI-инварианты

- layout страницы не создает горизонтальный scroll;
- элементы не выходят за viewport; горизонтальные media/category strips явно
  помечаются `data-horizontal-scroll` и прокручиваются внутри своего контейнера;
- controls и самостоятельные navigation links имеют target не меньше
  24 x 24 CSS px; для inline-ссылок применяется исключение WCAG 2.5.8;
- основные controls сохраняют высоту 44 px для удобного touch-ввода;
- радиусы обычных controls, media и surfaces ограничены системными токенами
  `--radius-control`, `--radius-media`, `--radius-surface`;
- focus ring централизован через `--focus-ring` и видим на keyboard focus;
- `prefers-reduced-motion` отключает декоративное движение и smooth scroll;
- public marketplace не использует декоративные radial/orb backgrounds,
  отрицательный letter spacing и карточки, вложенные только ради оформления.

Исключения: круглые avatar/status indicators и pill badges сохраняют
`border-radius: 9999px`, потому что форма несет семантическую функцию.

## Accessibility gate

Playwright запускает axe с правилами WCAG 2 A/AA, WCAG 2.1 A/AA и WCAG 2.2 AA.
Тест не допускает найденные нарушения на проверяемых публичных маршрутах.
Отдельно проверяются overflow и минимальный размер интерактивной области,
которые плохо выявляются одним статическим анализатором.

Запуск из корня frontend:

```bash
npm run test:e2e:responsive
```

Если локальный Next уже использует стандартные порты:

```bash
E2E_PORT=3012 E2E_API_PORT=4022 E2E_DIST_DIR=.next-e2e-responsive npm run test:e2e:responsive
```

## Ручное подтверждение

Перед release ответственный открывает HTML report, сравнивает 24 приложенных
скриншотов и подтверждает:

- header и основные actions не перекрываются;
- заголовки, цена и фильтры не обрезаны;
- карточки объявлений сохраняют читаемую информационную иерархию;
- light/dark theme имеют достаточный контраст;
- интерфейс остается рабочей витриной, без marketing hero и декоративных слоев.

Изменение layout-токенов или ключевых marketplace-компонентов требует нового
запуска матрицы и просмотра ее screenshot attachments.
