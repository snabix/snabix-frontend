import { GET } from "./route";

describe("frontend health endpoint", () => {
  it("returns a non-cacheable runtime status", async () => {
    const response = GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({
      revision: "unknown",
      status: "ok",
    });
  });
});
