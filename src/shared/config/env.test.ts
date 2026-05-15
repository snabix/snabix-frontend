import { createPublicEnv } from "@/src/shared/config/env";

describe("createPublicEnv", () => {
  it("normalizes a valid API URL", () => {
    expect(createPublicEnv("https://api.snabix.test/api/v1/")).toEqual({
      apiOrigin: "https://api.snabix.test",
      apiUrl: "https://api.snabix.test/api/v1",
    });
  });

  it("throws when API URL is missing", () => {
    expect(() => createPublicEnv(undefined)).toThrow(
      "Не задана обязательная переменная окружения NEXT_PUBLIC_API_URL.",
    );
  });

  it("throws when API URL is not absolute", () => {
    expect(() => createPublicEnv("/api/v1")).toThrow(
      "Переменная окружения NEXT_PUBLIC_API_URL должна содержать абсолютный URL.",
    );
  });
});
