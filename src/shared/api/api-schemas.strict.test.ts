import { describe, expect, it } from "vitest";
import {
  newsContentBlockSchema,
  publicListingItemSchema,
  userSchema,
} from "./api-schemas";

describe("strict API schemas", () => {
  it("rejects unknown fields in the stable user contract", () => {
    const result = userSchema.safeParse({
      id: "user-1",
      email: "user@example.com",
      firstName: "Иван",
      lastName: "Петров",
      phoneNumber: null,
      addresses: [],
      isActive: true,
      emailVerifiedAt: null,
      avatar: null,
      unexpectedField: true,
    });

    expect(result.success).toBe(false);
  });

  it("rejects private fields in the public listing contract", () => {
    const result = publicListingItemSchema.safeParse({
      id: "listing-1",
      category: null,
      type: 1,
      typeLabel: "Товар",
      status: 3,
      statusLabel: "Опубликовано",
      condition: 2,
      conditionLabel: "Б/у",
      title: "Ноутбук",
      slug: "noutbuk",
      description: "Описание объявления.",
      price: 85000,
      currency: "RUB",
      isNegotiable: true,
      viewsCount: 10,
      isFeatured: false,
      publishedAt: null,
      expiresAt: null,
      attributeValues: [],
      userId: "private-user-id",
    });

    expect(result.success).toBe(false);
  });

  it("allows provider-specific fields in extensible news blocks", () => {
    const result = newsContentBlockSchema.safeParse({
      id: "block-1",
      type: "paragraph",
      typeValue: 2,
      typeLabel: "Абзац",
      sortOrder: 1,
      text: "Текст новости.",
      futureProviderField: { enabled: true },
    });

    expect(result.success).toBe(true);
  });
});
