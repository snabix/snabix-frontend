export const region = {
  id: 77,
  name: "Московская область",
  fullName: "Московская область",
  label: "Московская область",
};

export const city = {
  id: 7701,
  name: "Москва",
  label: "Москва",
};

export const profileAddress: UserAddress = {
  id: "address-1",
  label: "Склад",
  addressLine: "ул. Тестовая, 10",
  isPrimary: true,
  region,
  city,
};

export function makeUser(addresses: UserAddress[] = [profileAddress]): User {
  return {
    id: "user-1",
    email: "user@snabix.test",
    firstName: "Иван",
    lastName: "Тестов",
    aboutMe: "Поставщик оборудования и материалов для строительных объектов.",
    phoneNumber: "+79991112233",
    addresses,
    isActive: true,
    emailVerifiedAt: "2026-06-20T12:00:00+00:00",
    avatar: null,
  };
}

export const leafCategory: CategoryNode = {
  id: 11,
  catalogType: 1,
  catalogTypeLabel: "Товар",
  parentId: 1,
  name: "Ноутбуки",
  slug: "laptops",
  description: null,
  icon: null,
  sortOrder: 10,
  isActive: true,
  path: "electronics/laptops",
  depth: 1,
  children: [],
};

export const rootCategory: CategoryNode = {
  id: 1,
  catalogType: 1,
  catalogTypeLabel: "Товар",
  parentId: null,
  name: "Электроника",
  slug: "electronics",
  description: null,
  icon: null,
  sortOrder: 10,
  isActive: true,
  path: "electronics",
  depth: 0,
  children: [leafCategory],
};

export function makeListing(overrides: Partial<ListingItem> = {}): ListingItem {
  return {
    id: "listing-1",
    userId: "user-1",
    category: {
      id: leafCategory.id,
      catalogType: 1,
      catalogTypeLabel: "Товар",
      parentId: rootCategory.id,
      name: leafCategory.name,
      slug: leafCategory.slug,
      fullName: "Электроника / Ноутбуки",
      path: "electronics/laptops",
      breadcrumbs: [
        { id: rootCategory.id, name: rootCategory.name, slug: rootCategory.slug },
        { id: leafCategory.id, name: leafCategory.name, slug: leafCategory.slug },
      ],
    },
    type: 1,
    typeLabel: "Товар",
    status: 3,
    statusLabel: "Опубликовано",
    condition: 2,
    conditionLabel: "Б/у",
    title: "Тестовый ноутбук",
    slug: "testovyi-noutbuk",
    description: "Описание тестового объявления для браузерного сценария.",
    price: 75_000,
    currency: "RUB",
    isNegotiable: true,
    contactName: "Иван Тестов",
    contactPhone: "+79991112233",
    contactEmail: "user@snabix.test",
    imageUrl: null,
    imageUrls: [],
    media: [],
    location: {
      source: "profile",
      profileAddressId: profileAddress.id,
      label: profileAddress.label,
      region,
      city,
      addressLine: profileAddress.addressLine,
      display: "Москва, ул. Тестовая, 10",
    },
    isFavorite: false,
    sellerRating: null,
    city: city.name,
    region: region.name,
    street: null,
    house: null,
    addressLine: profileAddress.addressLine,
    fullLocation: "Москва, ул. Тестовая, 10",
    viewsCount: 12,
    isFeatured: false,
    rejectionReason: null,
    publishedAt: "2026-06-20T12:00:00+00:00",
    expiresAt: null,
    attributeValues: [],
    ...overrides,
  };
}

export function toPublicListing(listing: ReturnType<typeof makeListing>) {
  const {
    contactEmail,
    contactName,
    contactPhone,
    rejectionReason,
    userId,
    ...publicListing
  } = listing;

  void contactEmail;
  void contactName;
  void contactPhone;
  void rejectionReason;
  void userId;

  return publicListing satisfies PublicListingItem;
}

export function paginated(items: unknown[]) {
  return {
    items,
    meta: {
      currentPage: 1,
      from: items.length > 0 ? 1 : null,
      lastPage: 1,
      perPage: 12,
      to: items.length > 0 ? items.length : null,
      total: items.length,
    },
  };
}
import type { CategoryNode } from "@/src/entities/category";
import type { ListingItem, PublicListingItem } from "@/src/entities/listing";
import type { User, UserAddress } from "@/src/entities/user";
