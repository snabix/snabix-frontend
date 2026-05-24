import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCategoryAttributes } from "@/src/entities/category/api/list-categories";
import { getMe } from "@/src/entities/user";
import { listListings, listPublicListings } from "@/src/features/listing/api";
import { api } from "@/src/shared/api";

const apiGetMock = vi.spyOn(api, "get");

const paginationMeta = {
  currentPage: 1,
  from: 1,
  lastPage: 2,
  perPage: 12,
  to: 12,
  total: 18,
};

const listingContract = {
  attributeValues: [
    {
      attributeDefinitionId: 10,
      displayValue: "16 ГБ",
      name: "Оперативная память",
      slug: "ram",
      type: 1,
      typeLabel: "Текст",
      value: "16 ГБ",
    },
  ],
  category: {
    catalogType: 1,
    catalogTypeLabel: "Товары",
    id: 5,
    name: "Ноутбуки",
    parentId: 2,
    slug: "noutbuki",
  },
  condition: 2,
  conditionLabel: "Б/у",
  contactEmail: "seller@example.com",
  contactName: "Seller",
  contactPhone: "+79990000000",
  currency: "RUB",
  description: "Игровой ноутбук.",
  expiresAt: null,
  id: "listing-1",
  imageUrl: "https://cdn.snabix.test/listing-1/main.png",
  imageUrls: [
    "https://cdn.snabix.test/listing-1/main.png",
    "https://cdn.snabix.test/listing-1/second.png",
  ],
  isFeatured: false,
  isNegotiable: true,
  price: 85000,
  publishedAt: "2026-05-24T10:00:00+00:00",
  rejectionReason: null,
  slug: "igrovoj-noutbuk",
  status: 3,
  statusLabel: "Опубликовано",
  title: "Игровой ноутбук",
  type: 1,
  typeLabel: "Товар",
  userId: "user-1",
  viewsCount: 42,
};

describe("api adapter contracts", () => {
  beforeEach(() => {
    apiGetMock.mockReset();
  });

  it("keeps auth me response shape for user session", async () => {
    const userContract = {
      addresses: [
        {
          addressLine: "ул. Ленина, 10",
          city: { id: 20, label: "Грозный", name: "Грозный" },
          id: "address-1",
          isPrimary: true,
          label: "Дом",
          region: {
            fullName: "Чеченская Республика",
            id: 95,
            label: "Чеченская Республика",
            name: "Чечня",
          },
        },
      ],
      avatar: {
        fileName: "avatar.png",
        humanReadableSize: "12 KB",
        id: 7,
        mimeType: "image/png",
        size: 12288,
        url: "https://cdn.snabix.test/avatar.png",
      },
      email: "user@example.com",
      emailVerifiedAt: "2026-05-24T10:00:00+00:00",
      firstName: "Иван",
      id: "user-1",
      isActive: true,
      lastName: "Петров",
      phoneNumber: "+79990000000",
    };

    apiGetMock.mockResolvedValueOnce({ data: { data: userContract } });

    await expect(getMe()).resolves.toEqual(userContract);
    expect(apiGetMock).toHaveBeenCalledWith("/auth/me");
  });

  it("unwraps private listings pagination contract", async () => {
    apiGetMock.mockResolvedValueOnce({
      data: {
        data: {
          items: [listingContract],
          meta: paginationMeta,
        },
      },
    });

    const result = await listListings({
      categoryId: 5,
      page: 1,
      perPage: 12,
      status: 3,
      type: 1,
    });

    expect(result.items).toEqual([listingContract]);
    expect(result.meta).toEqual(paginationMeta);
    expect(apiGetMock).toHaveBeenCalledWith("/listings", {
      params: {
        categoryId: 5,
        page: 1,
        perPage: 12,
        status: 3,
        type: 1,
      },
    });
  });

  it("unwraps public listings pagination contract with media fields", async () => {
    const publicListingContract = { ...listingContract };

    deletePartialListingField(publicListingContract, "contactEmail");
    deletePartialListingField(publicListingContract, "contactName");
    deletePartialListingField(publicListingContract, "contactPhone");
    deletePartialListingField(publicListingContract, "rejectionReason");
    deletePartialListingField(publicListingContract, "userId");

    apiGetMock.mockResolvedValueOnce({
      data: {
        data: {
          items: [publicListingContract],
          meta: {
            ...paginationMeta,
            perPage: 24,
          },
        },
      },
    });

    const result = await listPublicListings({
      categoryId: 5,
      maxPrice: 90000,
      minPrice: 80000,
      page: 1,
      perPage: 24,
      sort: "price_desc",
      type: 1,
    });

    expect(result.items[0]?.imageUrl).toBe("https://cdn.snabix.test/listing-1/main.png");
    expect(result.items[0]?.imageUrls).toHaveLength(2);
    expect(result.meta.perPage).toBe(24);
    expect(apiGetMock).toHaveBeenCalledWith("/public/listings", {
      params: {
        categoryId: 5,
        maxPrice: 90000,
        minPrice: 80000,
        page: 1,
        perPage: 24,
        sort: "price_desc",
        type: 1,
      },
    });
  });

  it("returns category attributes items from category attributes contract", async () => {
    const attributesContract = [
      {
        appliesToChildren: true,
        categoryId: 5,
        defaultValue: null,
        description: "Объем оперативной памяти.",
        groupName: "Характеристики",
        helpText: "Укажите значение как на устройстве.",
        id: 10,
        isActive: true,
        isFilterable: true,
        isInherited: false,
        isRequired: true,
        name: "Оперативная память",
        options: ["8 ГБ", "16 ГБ", "32 ГБ"],
        placeholder: "Например, 16 ГБ",
        showInCard: true,
        slug: "ram",
        sortOrder: 10,
        type: 4,
        typeLabel: "Выбор",
        unit: null,
      },
    ];

    apiGetMock.mockResolvedValueOnce({
      data: {
        data: {
          category: {
            catalogType: 1,
            catalogTypeLabel: "Товары",
            id: 5,
            name: "Ноутбуки",
            parentId: 2,
            slug: "noutbuki",
          },
          items: attributesContract,
        },
      },
    });

    await expect(getCategoryAttributes(5)).resolves.toEqual(attributesContract);
    expect(apiGetMock).toHaveBeenCalledWith("/categories/5/attributes");
  });
});

function deletePartialListingField(
  listing: Partial<typeof listingContract>,
  field: keyof typeof listingContract,
) {
  delete listing[field];
}
