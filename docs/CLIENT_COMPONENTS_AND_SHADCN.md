# Client Components и shadcn

Документ фиксирует baseline client graph и решения по развитию UI-kit.

## Baseline от 2026-07-19

Замеры выполнены на Node `22.23.1`, Next `16.2.10` одной и той же production
командой `npm run build`.

| Метрика | До | После | Изменение |
| --- | ---: | ---: | ---: |
| Явные `"use client"` entry points | 66 | 53 | -13 (-19,7%) |
| Употребления callback names `on*Action` | 460 | 0 | -460 |
| Route-specific JS главной, raw | 64 904 B | 61 084 B | -3 820 B (-5,9%) |
| Route-specific JS главной, gzip | 18 548 B | 17 807 B | -741 B (-4,0%) |
| Полный entry JS главной, gzip | 238 792 B | 238 240 B | -552 B |

Build hashes и общий framework chunk могут меняться после обновления
зависимостей. Для сравнения важны одинаковая команда, окружение и route.

## Правила boundaries

- Server Component остается вариантом по умолчанию.
- Client entry point нужен для state, effects, context providers, browser API
  и библиотек, требующих браузерный runtime.
- Наличие JSX, `onClick` или callback prop само по себе не требует новой
  директивы, если модуль импортируется только внутри существующего client graph.
- Статическая разметка не должна попадать в client graph только ради соседнего
  интерактивного элемента: интерактивность выделяется в небольшой island.
- `npm run architecture:client` удерживает текущий budget `53` и запрещает
  возвращение `on*Action`.

## Актуальные shadcn-компоненты

Проект остается на shadcn/Radix. Переход на Base UI не является оптимизацией сам
по себе: он затрагивает поведение primitives, composition API и accessibility.
Миграция допустима отдельно, по одному компоненту, с измерением и browser smoke.

В рамках текущей задачи внедрены:

- `Field`: единая композиция label, description и error под существующим
  `FormField`; публичный API форм и ARIA-связи сохранены.
- `Spinner`: единый loading indicator вместо повторяющихся
  `LoaderCircle + animate-spin`.
- `Button` и `Input`: оставлены server-compatible primitives без лишнего
  client entry point.

## Кандидаты на следующие итерации

| Компонент | Где применить | Решение |
| --- | --- | --- |
| `Input Group` | header search, password, phone и price inputs | Внедрять по одному flow: унифицирует addon-кнопки и focus ring, но требует visual/E2E regression. |
| `Native Select` | простые фильтры и адресные формы | Предпочтителен для небольших списков без поиска: сохраняет native UX и не добавляет headless runtime. |
| `Select` / `Combobox` | большие справочники городов и категорий | Использовать только с поиском, virtualization и keyboard smoke; обычный select не заменять без причины. |
| `Empty` | существующий `EmptyState` | Пока оставить domain wrapper: состояния уже централизованы, замена не уменьшит JS или дублирование. |
| `Item` | сессии и строки уведомлений | Возможен после стабилизации их domain actions; сейчас кастомная структура несет значимую информацию. |
| `Button Group` | pagination и компактные media controls | Добавлять, когда кнопки визуально образуют одну командную группу; не использовать как декоративную обертку. |
| `Carousel` | blog hero или media gallery | Не применять к серверной ленте категорий: это вернет JS туда, где достаточно CSS scroll/animation. |

Новые chat primitives (`Message`, `Bubble`, `Message Scroller`) текущим
marketplace-сценариям не нужны и не должны попадать в dependencies заранее.

Официальные источники:

- [shadcn components](https://ui.shadcn.com/docs/components)
- [shadcn July 2026: Base UI default](https://ui.shadcn.com/docs/changelog)
- [Field](https://ui.shadcn.com/docs/components/radix/field)
- [Input Group](https://ui.shadcn.com/docs/components/radix/input-group)
- [Next.js `use client`](https://nextjs.org/docs/app/api-reference/directives/use-client)
