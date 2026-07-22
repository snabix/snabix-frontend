# Backend/frontend API contracts

Frontend использует собственные Zod schemas и domain adapters. Generated
OpenAPI types не импортируются прямо в UI или entity model, потому что wire DTO,
compatibility aliases и внутреннее состояние приложения имеют разные задачи.

Для автоматической проверки выбранных стабильных DTO используется
`contracts/listings.v1.json`. Это синхронизированная копия provider snapshot из
`snabix-backend/contracts/listings.v1.json`.

Snapshot фиксирует:

- обязательные поля public и private listing DTO;
- поля, запрещенные на public privacy boundary;
- валидные wire examples для Zod adapters;
- связанные OpenAPI operations и response schemas.

## Проверка

```bash
npm run contracts:check
```

Vitest подтверждает, что public/private examples принимаются соответствующими
Zod adapters, а `userId`, контакты, moderation reason и полный media payload
отвергаются публичной схемой. Несовместимый rename или удаление поля ломает
backend provider test либо frontend consumer test.

## Обновление

1. Изменить backend DTO с учетом compatibility/deprecation policy.
2. Обновить provider snapshot и пройти backend `task contracts:check`.
3. Скопировать файл без ручного редактирования во frontend:

```bash
cp ../snabix-backend/contracts/listings.v1.json contracts/listings.v1.json
```

4. Обновить Zod adapter и выполнить `npm run contracts:check`.
5. При несовместимом изменении увеличить contract version и сохранить старый
   adapter на согласованный период миграции.

Полный OpenAPI JSON публикуется backend CI отдельным artifact-ом. Consumer
snapshot остается небольшим, чтобы privacy и DTO diff можно было проверить при
code review.
