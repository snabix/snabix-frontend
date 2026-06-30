import type { Page, Request, Route } from "@playwright/test";
import type { ListingItem } from "@/src/entities/listing";
import {
  city,
  leafCategory,
  makeListing,
  makeUser,
  paginated,
  region,
  rootCategory,
  toPublicListing,
} from "./contracts";

type ApiMockOptions = {
  addresses?: Parameters<typeof makeUser>[0];
  authenticated?: boolean;
};

type JsonObject = Record<string, unknown>;

export class SnabixApiMock {
  authenticated: boolean;
  favorite = false;
  lastAddressPayload: JsonObject | null = null;
  lastListingPayload: JsonObject | null = null;
  lastPublicQuery = new URLSearchParams();
  lastSignUpPayload: JsonObject | null = null;
  listing: ListingItem = makeListing();
  mediaUploads = 0;
  unauthorizedStatus: 401 | 419 = 401;
  user: ReturnType<typeof makeUser>;

  constructor(options: ApiMockOptions = {}) {
    this.authenticated = options.authenticated ?? true;
    this.user = makeUser(options.addresses);
  }

  async install(page: Page) {
    await page.route("http://localhost:8080/**", (route) => this.handle(route));
  }

  private async handle(route: Route) {
    const request = route.request();
    const url = new URL(request.url());
    const method = request.method();

    if (method === "OPTIONS" || url.pathname === "/sanctum/csrf-cookie") {
      await this.fulfill(route, 204);
      return;
    }

    if (url.pathname === "/api/v1/auth/sign-in" && method === "POST") {
      this.authenticated = true;
      await this.fulfill(route, 200, { message: "Signed in" });
      return;
    }

    if (url.pathname === "/api/v1/auth/sign-up" && method === "POST") {
      this.lastSignUpPayload = getJsonBody(request);
      await this.fulfill(route, 201, { message: "Registered" });
      return;
    }

    if (url.pathname === "/api/v1/auth/me" && method === "GET") {
      if (this.authenticated) {
        await this.fulfill(route, 200, { data: this.user });
      } else {
        await this.fulfillUnauthorized(route);
      }
      return;
    }

    if (isPrivateApiRequest(url.pathname) && !this.authenticated) {
      await this.fulfillUnauthorized(route);
      return;
    }

    if (url.pathname === "/api/v1/auth/me/addresses" && method === "PUT") {
      await this.replaceAddresses(route);
      return;
    }

    if (url.pathname === "/api/v1/categories/list") {
      await this.fulfill(route, 200, { data: [rootCategory] });
      return;
    }

    if (/\/api\/v1\/categories\/[^/]+\/branch$/.test(url.pathname)) {
      await this.fulfill(route, 200, { data: rootCategory });
      return;
    }

    if (/\/api\/v1\/categories\/[^/]+\/attributes$/.test(url.pathname)) {
      await this.fulfill(route, 200, {
        data: {
          category: pickCategorySummary(leafCategory),
          items: [],
        },
      });
      return;
    }

    if (url.pathname === "/api/v1/locations/regions") {
      await this.fulfill(route, 200, { data: { regions: [region] } });
      return;
    }

    if (url.pathname === "/api/v1/locations/cities") {
      await this.fulfill(route, 200, { data: { cities: [city] } });
      return;
    }

    if (url.pathname === "/api/v1/public/listings" && method === "GET") {
      this.lastPublicQuery = new URLSearchParams(url.searchParams);
      await this.fulfill(route, 200, {
        data: paginated([toPublicListing({ ...this.listing, isFavorite: this.favorite })]),
      });
      return;
    }

    if (url.pathname === "/api/v1/listings/favorites" && method === "GET") {
      await this.fulfill(route, 200, {
        data: paginated(this.favorite ? [{ ...this.listing, isFavorite: true }] : []),
      });
      return;
    }

    if (url.pathname === "/api/v1/listings" && method === "POST") {
      await this.createListing(route);
      return;
    }

    if (url.pathname === "/api/v1/listings" && method === "GET") {
      await this.fulfill(route, 200, { data: paginated([this.listing]) });
      return;
    }

    if (/\/api\/v1\/listings\/[^/]+\/media$/.test(url.pathname) && method === "POST") {
      this.mediaUploads += 1;
      this.listing = {
        ...this.listing,
        imageUrl: "/snabix-black.png",
        imageUrls: ["/snabix-black.png"],
        media: [{ id: 1, url: "/snabix-black.png", fileName: "listing.png", order: 1, isMain: true }],
      };
      await this.fulfill(route, 200, { data: this.listing });
      return;
    }

    if (/\/api\/v1\/listings\/[^/]+\/archive$/.test(url.pathname) && method === "POST") {
      this.listing = { ...this.listing, status: 5, statusLabel: "В архиве" };
      await this.fulfill(route, 200, { data: this.listing });
      return;
    }

    if (/\/api\/v1\/listings\/[^/]+\/favorite$/.test(url.pathname)) {
      this.favorite = method === "POST";
      await this.fulfill(route, 200, {
        data: { ...this.listing, isFavorite: this.favorite },
      });
      return;
    }

    if (/\/api\/v1\/listings\/[^/]+$/.test(url.pathname) && method === "PATCH") {
      const payload = getJsonBody(request);
      this.listing = { ...this.listing, ...pickListingChanges(payload) };
      await this.fulfill(route, 200, { data: this.listing });
      return;
    }

    if (/\/api\/v1\/listings\/[^/]+$/.test(url.pathname) && method === "GET") {
      await this.fulfill(route, 200, { data: this.listing });
      return;
    }

    await this.fulfill(route, 404, { message: `Unhandled e2e route: ${method} ${url.pathname}` });
  }

  private async createListing(route: Route) {
    const payload = getJsonBody(route.request());
    const isDraft = payload.saveAsDraft === true;

    this.lastListingPayload = payload;
    this.listing = makeListing({
      ...pickListingChanges(payload),
      status: isDraft ? 1 : 2,
      statusLabel: isDraft ? "Черновик" : "На проверке",
    });
    await this.fulfill(route, 201, { data: this.listing });
  }

  private async replaceAddresses(route: Route) {
    const payload = getJsonBody(route.request());
    const items = Array.isArray(payload.addresses) ? payload.addresses : [];

    this.lastAddressPayload = payload;
    this.user = {
      ...this.user,
      addresses: items.map((item, index) => {
        const address = item as JsonObject;
        return {
          id: String(address.id ?? `address-${index + 1}`),
          label: typeof address.label === "string" ? address.label : null,
          addressLine: typeof address.addressLine === "string" ? address.addressLine : null,
          isPrimary: address.isPrimary === true,
          region,
          city: address.cityId ? city : null,
        };
      }),
    };
    await this.fulfill(route, 200, { data: { addresses: this.user.addresses } });
  }

  private async fulfill(route: Route, status: number, body?: JsonObject) {
    const origin = route.request().headers().origin ?? "http://localhost:3001";

    await route.fulfill({
      body: body === undefined ? "" : JSON.stringify(body),
      contentType: body === undefined ? undefined : "application/json",
      headers: {
        "access-control-allow-credentials": "true",
        "access-control-allow-headers": "content-type,x-xsrf-token,x-requested-with",
        "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        "access-control-allow-origin": origin,
      },
      status,
    });
  }

  private async fulfillUnauthorized(route: Route) {
    await this.fulfill(route, this.unauthorizedStatus, {
      message: this.unauthorizedStatus === 419
        ? "CSRF token mismatch"
        : "Unauthenticated",
    });
  }
}

function isPrivateApiRequest(pathname: string): boolean {
  return [
    "/api/v1/auth/me/addresses",
    "/api/v1/auth/sessions",
    "/api/v1/listings",
    "/api/v1/listings/favorites",
    "/api/v1/notifications",
  ].some((privatePath) => pathname === privatePath || pathname.startsWith(`${privatePath}/`));
}

function getJsonBody(request: Request): JsonObject {
  try {
    return request.postDataJSON() as JsonObject;
  } catch {
    return {};
  }
}

function pickCategorySummary(category: typeof leafCategory) {
  const { id, catalogType, catalogTypeLabel, parentId, name, slug } = category;
  return { id, catalogType, catalogTypeLabel, parentId, name, slug };
}

function pickListingChanges(payload: JsonObject): Partial<ListingItem> {
  return {
    ...(typeof payload.title === "string" ? { title: payload.title } : {}),
    ...(typeof payload.description === "string" ? { description: payload.description } : {}),
    ...(typeof payload.price === "number" || payload.price === null ? { price: payload.price } : {}),
    ...(typeof payload.currency === "string" || payload.currency === null ? { currency: payload.currency } : {}),
  };
}
