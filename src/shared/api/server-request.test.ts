import { z } from "zod";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ServerApiError,
  serverGetData,
} from "./server-request";

const payloadSchema = z.object({
  id: z.string(),
  title: z.string(),
}).strict();

describe("server API client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses public caching without forwarding credentials", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        data: {
          id: "listing-1",
          title: "Тестовый ноутбук",
        },
      }), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const result = await serverGetData(
      payloadSchema,
      "/public/listings/listing-1",
      {
        errorMessage: "Не удалось загрузить объявление.",
        query: {
          empty: undefined,
          page: 1,
        },
        revalidate: 60,
        tags: ["public-listings", "public-listing:listing-1"],
      },
    );

    expect(result.title).toBe("Тестовый ноутбук");
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, options] = fetchMock.mock.calls[0] as [URL, RequestInit & {
      next: {
        revalidate: number;
        tags: string[];
      };
    }];

    expect(url.searchParams.get("page")).toBe("1");
    expect(url.searchParams.has("empty")).toBe(false);
    expect(options.credentials).toBe("omit");
    expect(options.headers).toEqual({ Accept: "application/json" });
    expect(options.next).toEqual({
      revalidate: 60,
      tags: ["public-listings", "public-listing:listing-1"],
    });
  });

  it("preserves upstream status for route-level not found handling", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(null, { status: 404 }),
    ));

    await expect(serverGetData(payloadSchema, "/missing", {
      errorMessage: "Объявление не найдено.",
      revalidate: 60,
      tags: ["public-listings"],
    })).rejects.toEqual(
      expect.objectContaining<Partial<ServerApiError>>({
        name: "ServerApiError",
        status: 404,
      }),
    );
  });
});
