import { describe, expect, it } from "vitest";
import { unwrapApiData, unwrapApiItems, unwrapApiPagination } from "@/src/shared/api/response";

describe("api response helpers", () => {
  it("unwraps a regular data response", () => {
    expect(unwrapApiData({ data: { ok: true } })).toEqual({ ok: true });
  });

  it("unwraps paginated items without leaking pagination wrapper into UI", () => {
    expect(
      unwrapApiItems({
        data: {
          items: [{ id: "listing-1" }],
          meta: {
            currentPage: 1,
            from: 1,
            lastPage: 1,
            perPage: 24,
            to: 1,
            total: 1,
          },
        },
      }),
    ).toEqual([{ id: "listing-1" }]);
  });

  it("unwraps paginated data with items and meta", () => {
    expect(
      unwrapApiPagination({
        data: {
          items: [{ id: "listing-1" }],
          meta: {
            currentPage: 2,
            from: 25,
            lastPage: 4,
            perPage: 24,
            to: 48,
            total: 80,
          },
        },
      }),
    ).toEqual({
      items: [{ id: "listing-1" }],
      meta: {
        currentPage: 2,
        from: 25,
        lastPage: 4,
        perPage: 24,
        to: 48,
        total: 80,
      },
    });
  });
});
