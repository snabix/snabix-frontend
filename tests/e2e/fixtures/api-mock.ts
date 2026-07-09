import type { Page, Request, Route } from "@playwright/test";
import type { UserNotification, NotificationPreference } from "@/src/entities/notification";
import type { ListingItem } from "@/src/entities/listing";
import type { ActiveUserSession } from "@/src/features/auth/model/types";
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
  deletedNotificationIds: string[] = [];
  favorite = false;
  lastAddressPayload: JsonObject | null = null;
  lastListingPayload: JsonObject | null = null;
  lastNotificationPreferencesPayload: JsonObject | null = null;
  lastProfileDataExportRequested = false;
  lastProfilePayload: JsonObject | null = null;
  lastPublicQuery = new URLSearchParams();
  lastSignUpPayload: JsonObject | null = null;
  listing: ListingItem = makeListing();
  markAllNotificationsReadCalls = 0;
  mediaUploads = 0;
  notificationPreferences: NotificationPreference[] = makeNotificationPreferences();
  notifications: UserNotification[] = makeNotifications();
  reorderedMediaIds: number[] = [];
  sessions: ActiveUserSession[] = makeSessions();
  terminatedSessionIds: string[] = [];
  terminatedOtherSessions = false;
  unauthorizedStatus: 401 | 419 = 401;
  user: ReturnType<typeof makeUser>;
  verificationCode: string | null = null;

  constructor(options: ApiMockOptions = {}) {
    this.authenticated = options.authenticated ?? true;
    this.user = makeUser(options.addresses);
  }

  async install(page: Page) {
    await page.route(/^http:\/\/(?:localhost|127\.0\.0\.1):8080\/.*$/, (route) => this.handle(route));
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

    if (url.pathname === "/api/v1/auth/email-verification-notification" && method === "POST") {
      this.verificationCode = "123456";
      await this.fulfill(route, 200, {
        data: {
          cooldownSeconds: 0,
          message: "Код подтверждения отправлен.",
          sent: true,
        },
      });
      return;
    }

    if (url.pathname === "/api/v1/auth/verify-email" && method === "POST") {
      const payload = getJsonBody(request);
      const verified = payload.code === (this.verificationCode ?? "123456");

      if (verified) {
        this.user = {
          ...this.user,
          emailVerifiedAt: "2026-07-01T12:00:00+00:00",
        };
      }

      await this.fulfill(route, verified ? 200 : 422, verified
        ? {
            data: {
              alreadyVerified: false,
              message: "Email подтвержден.",
              verified: true,
            },
          }
        : { message: "Код подтверждения недействителен." });
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

    if (url.pathname === "/api/v1/auth/me" && method === "PATCH") {
      await this.updateProfile(route);
      return;
    }

    if (url.pathname === "/api/v1/auth/me/data-export" && method === "POST") {
      this.lastProfileDataExportRequested = true;
      await this.fulfill(route, 200, {
        data: {
          message: "Запрос отправлен. Письмо с данными профиля придет на email аккаунта.",
          requested: true,
        },
      });
      return;
    }

    if (url.pathname === "/api/v1/auth/me/addresses" && method === "PUT") {
      await this.replaceAddresses(route);
      return;
    }

    if (url.pathname === "/api/v1/auth/sessions" && method === "GET") {
      await this.fulfill(route, 200, { data: { items: this.sessions } });
      return;
    }

    if (url.pathname === "/api/v1/auth/sessions" && method === "DELETE") {
      this.terminatedOtherSessions = true;
      this.sessions = this.sessions.filter((session) => session.isCurrent);
      await this.fulfill(route, 200, { data: { terminated: true, terminatedCount: 1 } });
      return;
    }

    const sessionDeleteMatch = url.pathname.match(/^\/api\/v1\/auth\/sessions\/([^/]+)$/);

    if (sessionDeleteMatch && method === "DELETE") {
      const sessionId = sessionDeleteMatch[1];
      const session = this.sessions.find((item) => item.id === sessionId);

      this.terminatedSessionIds.push(sessionId);
      this.sessions = this.sessions.filter((item) => item.id !== sessionId);

      if (session?.isCurrent) {
        this.authenticated = false;
      }

      await this.fulfill(route, 200, { data: { terminated: true } });
      return;
    }

    if (url.pathname === "/api/v1/notifications/preferences" && method === "GET") {
      await this.fulfill(route, 200, { data: { items: this.notificationPreferences } });
      return;
    }

    if (url.pathname === "/api/v1/notifications/preferences" && method === "PUT") {
      await this.updateNotificationPreferences(route);
      return;
    }

    if (url.pathname === "/api/v1/notifications/preferences" && method === "DELETE") {
      this.notificationPreferences = makeNotificationPreferences();
      await this.fulfill(route, 200, { data: { items: this.notificationPreferences } });
      return;
    }

    if (url.pathname === "/api/v1/notifications" && method === "GET") {
      await this.fulfill(route, 200, {
        data: {
          items: this.notifications,
          meta: paginated(this.notifications).meta,
          unreadCount: this.notifications.filter((notification) => !notification.isRead).length,
        },
      });
      return;
    }

    if (url.pathname === "/api/v1/notifications/read-all" && method === "PATCH") {
      this.markAllNotificationsReadCalls += 1;
      this.notifications = this.notifications.map((notification) => ({
        ...notification,
        isRead: true,
        readAt: notification.readAt ?? "2026-07-01T12:00:00+00:00",
      }));
      await this.fulfill(route, 200, { data: { markedRead: true } });
      return;
    }

    const notificationReadMatch = url.pathname.match(/^\/api\/v1\/notifications\/([^/]+)\/read$/);

    if (notificationReadMatch && method === "PATCH") {
      const notificationId = notificationReadMatch[1];

      this.notifications = this.notifications.map((notification) => (
        notification.id === notificationId
          ? { ...notification, isRead: true, readAt: "2026-07-01T12:00:00+00:00" }
          : notification
      ));

      await this.fulfill(route, 200, {
        data: this.notifications.find((notification) => notification.id === notificationId),
      });
      return;
    }

    if (url.pathname === "/api/v1/notifications" && method === "DELETE") {
      this.deletedNotificationIds.push(...this.notifications.map((notification) => notification.id));
      this.notifications = [];
      await this.fulfill(route, 200, { data: { deleted: true } });
      return;
    }

    const notificationDeleteMatch = url.pathname.match(/^\/api\/v1\/notifications\/([^/]+)$/);

    if (notificationDeleteMatch && method === "DELETE") {
      const notificationId = notificationDeleteMatch[1];

      this.deletedNotificationIds.push(notificationId);
      this.notifications = this.notifications.filter((notification) => notification.id !== notificationId);
      await this.fulfill(route, 200, { data: { deleted: true } });
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
      const requestedNegotiable = url.searchParams.get("isNegotiable");
      const publicListing = toPublicListing({ ...this.listing, isFavorite: this.favorite });
      const items = requestedNegotiable === null || String(publicListing.isNegotiable) === requestedNegotiable
        ? [publicListing]
        : [];

      await this.fulfill(route, 200, {
        data: paginated(items),
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

    if (/\/api\/v1\/listings\/[^/]+\/media\/reorder$/.test(url.pathname) && method === "PATCH") {
      const payload = getJsonBody(request);
      const mediaIds = Array.isArray(payload.mediaIds) ? payload.mediaIds.map(Number) : [];

      this.reorderedMediaIds = mediaIds;
      this.listing = {
        ...this.listing,
        media: mediaIds
          .map((mediaId, index) => this.listing.media?.find((item) => item.id === mediaId) !== undefined
            ? {
                ...this.listing.media.find((item) => item.id === mediaId)!,
                isMain: index === 0,
                order: index + 1,
              }
            : null)
          .filter((item): item is NonNullable<typeof item> => item !== null),
      };
      await this.fulfill(route, 200, { data: this.listing });
      return;
    }

    const setMainMediaMatch = url.pathname.match(/^\/api\/v1\/listings\/[^/]+\/media\/(\d+)\/main$/);

    if (setMainMediaMatch && method === "PATCH") {
      const mediaId = Number(setMainMediaMatch[1]);
      const media = this.listing.media ?? [];
      const selectedMedia = media.find((item) => item.id === mediaId);

      if (selectedMedia !== undefined) {
        const nextMedia = [
          selectedMedia,
          ...media.filter((item) => item.id !== mediaId),
        ].map((item, index) => ({
          ...item,
          isMain: index === 0,
          order: index + 1,
        }));

        this.listing = {
          ...this.listing,
          imageUrl: selectedMedia.url,
          imageUrls: nextMedia.map((item) => item.url),
          media: nextMedia,
        };
      }

      await this.fulfill(route, 200, { data: this.listing });
      return;
    }

    const deleteMediaMatch = url.pathname.match(/^\/api\/v1\/listings\/[^/]+\/media\/(\d+)$/);

    if (deleteMediaMatch && method === "DELETE") {
      const mediaId = Number(deleteMediaMatch[1]);
      const nextMedia = (this.listing.media ?? [])
        .filter((item) => item.id !== mediaId)
        .map((item, index) => ({
          ...item,
          isMain: index === 0,
          order: index + 1,
        }));

      this.listing = {
        ...this.listing,
        imageUrl: nextMedia[0]?.url ?? null,
        imageUrls: nextMedia.map((item) => item.url),
        media: nextMedia,
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

  private async updateProfile(route: Route) {
    const payload = getJsonBody(route.request());

    this.lastProfilePayload = payload;
    this.user = {
      ...this.user,
      email: typeof payload.email === "string" ? payload.email : this.user.email,
      emailVerifiedAt: typeof payload.email === "string" && payload.email !== this.user.email
        ? null
        : this.user.emailVerifiedAt,
      firstName: typeof payload.firstName === "string" ? payload.firstName : this.user.firstName,
      lastName: typeof payload.lastName === "string" ? payload.lastName : this.user.lastName,
      phoneNumber: typeof payload.phoneNumber === "string" || payload.phoneNumber === null
        ? payload.phoneNumber
        : this.user.phoneNumber,
    };

    await this.fulfill(route, 200, { data: this.user });
  }

  private async updateNotificationPreferences(route: Route) {
    const payload = getJsonBody(route.request());
    const items = Array.isArray(payload.items) ? payload.items : [];

    this.lastNotificationPreferencesPayload = payload;
    this.notificationPreferences = this.notificationPreferences.map((preference) => {
      const update = items.find((item) => (
        typeof item === "object"
          && item !== null
          && "key" in item
          && item.key === preference.key
      )) as JsonObject | undefined;

      return update === undefined
        ? preference
        : {
            ...preference,
            emailEnabled: typeof update.emailEnabled === "boolean" ? update.emailEnabled : preference.emailEnabled,
            siteEnabled: typeof update.siteEnabled === "boolean" ? update.siteEnabled : preference.siteEnabled,
          };
    });

    await this.fulfill(route, 200, { data: { items: this.notificationPreferences } });
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

function makeNotificationPreferences(): NotificationPreference[] {
  return [
    {
      key: "listing.favorite.created",
      category: "activity",
      title: "Добавление в избранное",
      description: "Когда ваше объявление добавляют в избранное.",
      siteEnabled: true,
      emailEnabled: false,
      isRequired: false,
    },
    {
      key: "auth.login",
      category: "system",
      title: "Вход в аккаунт",
      description: "Уведомлять о новых входах в аккаунт.",
      siteEnabled: true,
      emailEnabled: true,
      isRequired: true,
    },
  ];
}

function makeNotifications(): UserNotification[] {
  return [
    {
      id: "notification-1",
      eventKey: "listing.favorite.created",
      category: "activity",
      title: "Объявление добавили в избранное",
      body: "Тестовый ноутбук теперь в избранном у покупателя.",
      actionUrl: null,
      context: {},
      isRead: false,
      createdAt: "2026-07-01T12:00:00+00:00",
      readAt: null,
    },
    {
      id: "notification-2",
      eventKey: "auth.login",
      category: "system",
      title: "Новый вход в аккаунт",
      body: "Выполнен вход с устройства Chrome.",
      actionUrl: null,
      context: {},
      isRead: true,
      createdAt: "2026-07-01T11:00:00+00:00",
      readAt: "2026-07-01T11:01:00+00:00",
    },
  ];
}

function makeSessions(): ActiveUserSession[] {
  return [
    {
      id: "session-current",
      deviceName: "MacBook Pro",
      browser: "Firefox",
      ipAddress: "127.0.0.1",
      locationLabel: "Локальная сеть",
      type: "desktop",
      isCurrent: true,
      lastActivityAt: "2026-07-01T12:00:00+00:00",
    },
    {
      id: "session-mobile",
      deviceName: "iPhone",
      browser: "Safari",
      ipAddress: "10.0.0.2",
      locationLabel: "Частная сеть",
      type: "mobile",
      isCurrent: false,
      lastActivityAt: "2026-07-01T10:00:00+00:00",
    },
  ];
}

function isPrivateApiRequest(pathname: string): boolean {
  return [
    "/api/v1/auth/me",
    "/api/v1/auth/me/addresses",
    "/api/v1/auth/me/data-export",
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
