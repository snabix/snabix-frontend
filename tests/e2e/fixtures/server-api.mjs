import { createServer } from "node:http";

const port = Number(process.env.E2E_API_PORT ?? 4010);

const category = {
  id: 1,
  catalogType: 1,
  catalogTypeLabel: "Товар",
  parentId: null,
  name: "Электроника",
  slug: "electronics",
  description: "Техника и электроника для дома и работы.",
  icon: null,
  sortOrder: 10,
  isActive: true,
  path: "electronics",
  depth: 0,
  children: [{
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
  }],
};

const listing = {
  id: "listing-1",
  category: {
    id: 11,
    catalogType: 1,
    catalogTypeLabel: "Товар",
    parentId: 1,
    name: "Ноутбуки",
    slug: "laptops",
    fullName: "Электроника / Ноутбуки",
    path: "electronics/laptops",
    breadcrumbs: [
      { id: 1, name: "Электроника", slug: "electronics" },
      { id: 11, name: "Ноутбуки", slug: "laptops" },
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
  price: 75000,
  currency: "RUB",
  isNegotiable: true,
  imageUrl: null,
  imageUrls: [],
  location: {
    source: "profile",
    profileAddressId: "address-1",
    label: "Склад",
    region: {
      id: 77,
      name: "Московская область",
      fullName: "Московская область",
      label: "Московская область",
    },
    city: {
      id: 7701,
      name: "Москва",
      label: "Москва",
    },
    addressLine: "ул. Тестовая, 10",
    display: "Москва, ул. Тестовая, 10",
  },
  isFavorite: false,
  sellerRating: null,
  sellerReviewCount: 0,
  city: "Москва",
  region: "Московская область",
  street: null,
  house: null,
  addressLine: "ул. Тестовая, 10",
  fullLocation: "Москва, ул. Тестовая, 10",
  viewsCount: 12,
  isFeatured: false,
  publishedAt: "2026-06-20T12:00:00+00:00",
  expiresAt: null,
  attributeValues: [],
};

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

  if (url.pathname === "/health") {
    respond(response, 200, { status: "ok" });
    return;
  }

  if (url.pathname === "/api/v1/categories/list") {
    respond(response, 200, { data: [category] });
    return;
  }

  if (/^\/api\/v1\/categories\/[^/]+\/branch$/.test(url.pathname)) {
    respond(response, 200, { data: category });
    return;
  }

  if (url.pathname === "/api/v1/public/listings") {
    const item = {
      ...listing,
      isFavorite: request.headers.cookie ? true : false,
    };

    respond(response, 200, {
      data: {
        items: [item],
        meta: {
          currentPage: 1,
          from: 1,
          lastPage: 1,
          perPage: Number(url.searchParams.get("perPage") ?? 15),
          to: 1,
          total: 1,
        },
      },
    });
    return;
  }

  if (url.pathname === `/api/v1/public/listings/${listing.id}`) {
    respond(response, 200, {
      data: {
        ...listing,
        isFavorite: request.headers.cookie ? true : false,
      },
    });
    return;
  }

  respond(response, 404, {
    message: "Not found",
  });
});

server.listen(port, "127.0.0.1");

function respond(response, status, body) {
  response.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body));
}

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
