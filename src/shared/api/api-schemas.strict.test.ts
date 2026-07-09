import { describe, expect, it } from "vitest";
import {
  LISTING_CONDITION_USED,
  LISTING_STATUS_PUBLISHED,
  LISTING_TYPE_PRODUCT,
} from "@/src/entities/listing";
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
      aboutMe: "Поставляю материалы для промышленных объектов.",
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
      type: LISTING_TYPE_PRODUCT,
      typeLabel: "Товар",
      status: LISTING_STATUS_PUBLISHED,
      statusLabel: "Опубликовано",
      condition: LISTING_CONDITION_USED,
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

  it("rejects fields that do not belong to a typed news block", () => {
    const result = newsContentBlockSchema.safeParse({
      id: "block-1",
      type: "paragraph",
      typeValue: 2,
      typeLabel: "Абзац",
      sortOrder: 1,
      text: "Текст новости.",
      author: "Лишнее поле для paragraph.",
    });

    expect(result.success).toBe(false);
  });
});
