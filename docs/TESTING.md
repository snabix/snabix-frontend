# Frontend Testing Standard

## Unit And Integration Tests

Unit and integration tests stay colocated with the code they protect:

- `src/features/**/model/*.test.ts`
- `src/features/**/ui/*.test.tsx`
- `src/entities/**/model/*.test.ts`
- `src/shared/**/**/*.test.ts`

This matches the current Feature-Sliced Design structure: a slice owns its model, UI, API adapter and tests together. When a feature moves, its tests move with it.

## Browser And E2E Tests

Browser-level smoke and E2E tests should be stored separately under:

- `tests/e2e/**`

Use this only for real browser flows such as auth, profile navigation, listing cards, mobile header/footer and account sidebar QA. Component-like tests should not be moved there.

## Current Command

Run all frontend tests with:

```bash
npm run test
```
