import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { api } from "./axios";
import {
  deleteData,
  getData,
  getPaginated,
  patchData,
  postData,
} from "./validated-request";

const apiGetMock = vi.spyOn(api, "get");
const apiPostMock = vi.spyOn(api, "post");
const apiPatchMock = vi.spyOn(api, "patch");
const apiDeleteMock = vi.spyOn(api, "delete");
const itemSchema = z.object({ id: z.string() });

describe("validated API requests", () => {
  beforeEach(() => {
    apiGetMock.mockReset();
    apiPostMock.mockReset();
    apiPatchMock.mockReset();
    apiDeleteMock.mockReset();
  });

  it("gets and validates a data response", async () => {
    apiGetMock.mockResolvedValueOnce({ data: { data: { id: "item-1" } } });

    await expect(getData(itemSchema, "/items/item-1", {
      errorMessage: "Некорректный item contract.",
    })).resolves.toEqual({ id: "item-1" });
    expect(apiGetMock).toHaveBeenCalledWith("/items/item-1");
  });

  it("gets and validates paginated data with request config", async () => {
    apiGetMock.mockResolvedValueOnce({
      data: {
        data: {
          items: [{ id: "item-1" }],
          meta: {
            currentPage: 1,
            from: 1,
            lastPage: 1,
            perPage: 12,
            to: 1,
            total: 1,
          },
        },
      },
    });

    const result = await getPaginated(itemSchema, "/items", {
      config: { params: { page: 1 } },
      errorMessage: "Некорректный pagination contract.",
    });

    expect(result.items).toEqual([{ id: "item-1" }]);
    expect(apiGetMock).toHaveBeenCalledWith("/items", { params: { page: 1 } });
  });

  it("posts and patches without adding unused axios arguments", async () => {
    apiPostMock.mockResolvedValueOnce({ data: { data: { id: "item-1" } } });
    apiPatchMock.mockResolvedValueOnce({ data: { data: { id: "item-1" } } });

    await postData(itemSchema, "/items", { name: "Item" }, {
      errorMessage: "Некорректный create contract.",
    });
    await patchData(itemSchema, "/items/item-1/publish", undefined, {
      errorMessage: "Некорректный publish contract.",
    });

    expect(apiPostMock).toHaveBeenCalledWith("/items", { name: "Item" });
    expect(apiPatchMock).toHaveBeenCalledWith("/items/item-1/publish");
  });

  it("deletes and validates a data response", async () => {
    apiDeleteMock.mockResolvedValueOnce({ data: { data: { id: "item-1" } } });

    await expect(deleteData(itemSchema, "/items/item-1", {
      errorMessage: "Некорректный delete contract.",
    })).resolves.toEqual({ id: "item-1" });
    expect(apiDeleteMock).toHaveBeenCalledWith("/items/item-1");
  });

  it("rejects a response that does not match the contract", async () => {
    apiGetMock.mockResolvedValueOnce({ data: { data: { id: 123 } } });

    await expect(getData(itemSchema, "/items/item-1", {
      errorMessage: "Некорректный item contract.",
    })).rejects.toThrow("Некорректный item contract.");
  });
});
