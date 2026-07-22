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
} from "@/src/shared/api/api-schemas";

describe("strict API schemas", () => {
  it("accepts a user who has not filled in a personal name", () => {
    const result = userSchema.safeParse({
      addresses: [],
      avatar: null,
      dateOfBirth: null,
      description: null,
      email: "unnamed@example.com",
      emailVerifiedAt: null,
      firstName: null,
      id: "user-without-name",
      isActive: true,
      lastName: null,
      phoneNumber: null,
    });

    expect(result.success).toBe(true);
  });

  it("rejects unknown fields in the stable user contract", () => {
    const result = userSchema.safeParse({
      id: "user-1",
      email: "user@example.com",
      firstName: "Иван",
      lastName: "Петров",
      description: "Поставляю материалы для промышленных объектов.",
      dateOfBirth: "1994-05-12",
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
      listingKind: LISTING_TYPE_PRODUCT,
      listingKindLabel: "Товар",
      listingStatus: LISTING_STATUS_PUBLISHED,
      listingStatusLabel: "Опубликовано",
      itemCondition: LISTING_CONDITION_USED,
      itemConditionLabel: "Б/у",
      title: "Ноутбук",
      slug: "noutbuk",
      description: "Описание объявления.",
      priceAmountMinor: 85000,
      priceCurrency: "RUB",
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

  it("normalizes deprecated numeric listing aliases without leaking them to domain data", () => {
    const result = publicListingItemSchema.parse({
      id: "legacy-listing",
      category: null,
      type: 1,
      typeLabel: "Товар",
      status: 3,
      statusLabel: "Опубликовано",
      condition: 2,
      conditionLabel: "Б/у",
      title: "Совместимый ответ",
      slug: "sovmestimyj-otvet",
      description: "Старый wire-контракт проходит только через compatibility adapter.",
      price: 85000,
      currency: "RUB",
      isNegotiable: false,
      viewsCount: 0,
      isFeatured: false,
      publishedAt: null,
      expiresAt: null,
      attributeValues: [],
    });

    expect(result).toMatchObject({
      listingKind: "product",
      listingStatus: "published",
      itemCondition: "used",
      priceAmountMinor: 85000,
      priceCurrency: "RUB",
    });
    expect(result).not.toHaveProperty("type");
    expect(result).not.toHaveProperty("status");
    expect(result).not.toHaveProperty("condition");
    expect(result).not.toHaveProperty("price");
    expect(result).not.toHaveProperty("currency");
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
