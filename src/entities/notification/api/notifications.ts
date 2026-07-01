import { z } from "zod";
import type {
  NotificationFeed,
  NotificationPreference,
  UserNotification,
} from "@/src/entities/notification/model/types";
import { deleteData, getData, patchData, putData } from "@/src/shared/api";

const categorySchema = z.enum(["listings", "messages", "activity", "system"]);
const preferenceSchema = z.object({
  key: z.string(),
  category: categorySchema,
  title: z.string(),
  description: z.string(),
  siteEnabled: z.boolean(),
  emailEnabled: z.boolean(),
  isRequired: z.boolean(),
}).strict();
const notificationSchema = z.object({
  id: z.string(),
  eventKey: z.string(),
  category: categorySchema,
  title: z.string(),
  body: z.string(),
  actionUrl: z.string().nullable(),
  context: z.preprocess(
    (value) => Array.isArray(value) && value.length === 0 ? {} : value,
    z.record(z.string(), z.unknown()),
  ),
  isRead: z.boolean(),
  createdAt: z.string().nullable(),
  readAt: z.string().nullable(),
}).strict();
const preferencesSchema = z.object({ items: z.array(preferenceSchema) }).strict();
const feedSchema = z.object({
  items: z.array(notificationSchema),
  unreadCount: z.number(),
  meta: z.object({
    currentPage: z.number(),
    from: z.number().nullable().optional(),
    lastPage: z.number(),
    perPage: z.number(),
    to: z.number().nullable().optional(),
    total: z.number(),
  }).strict(),
}).strict();

export async function getNotificationPreferences(): Promise<NotificationPreference[]> {
  const payload = await getData(preferencesSchema, "/notifications/preferences", {
    errorMessage: "Ответ настроек уведомлений имеет неверный формат.",
  });

  return payload.items;
}

export async function updateNotificationPreferences(
  items: NotificationPreference[],
): Promise<NotificationPreference[]> {
  const preferences = items.map(({ key, siteEnabled, emailEnabled }) => ({
    key,
    siteEnabled,
    emailEnabled,
  }));
  const payload = await putData(
    preferencesSchema,
    "/notifications/preferences",
    { items: preferences },
    {
      errorMessage: "Ответ сохранения настроек уведомлений имеет неверный формат.",
    },
  );

  return payload.items;
}

export async function resetNotificationPreferences(): Promise<NotificationPreference[]> {
  const payload = await deleteData(preferencesSchema, "/notifications/preferences", {
    errorMessage: "Ответ сброса настроек уведомлений имеет неверный формат.",
  });

  return payload.items;
}

export async function listNotifications(): Promise<NotificationFeed> {
  const payload = await getData(feedSchema, "/notifications", {
    config: { params: { perPage: 8 } },
    errorMessage: "Ответ списка уведомлений имеет неверный формат.",
  });

  return { items: payload.items, unreadCount: payload.unreadCount };
}

export function markNotificationRead(notificationId: string): Promise<UserNotification> {
  return patchData(notificationSchema, `/notifications/${notificationId}/read`, undefined, {
    errorMessage: "Не удалось отметить уведомление прочитанным.",
  });
}

export function markAllNotificationsRead(): Promise<{ markedRead: boolean }> {
  return patchData(
    z.object({ markedRead: z.boolean() }).strict(),
    "/notifications/read-all",
    undefined,
    { errorMessage: "Не удалось отметить уведомления прочитанными." },
  );
}

export function deleteNotification(notificationId: string): Promise<{ deleted: boolean }> {
  return deleteData(
    z.object({ deleted: z.boolean() }).strict(),
    `/notifications/${notificationId}`,
    { errorMessage: "Не удалось удалить уведомление." },
  );
}

export function deleteAllNotifications(): Promise<{ deleted: boolean }> {
  return deleteData(
    z.object({ deleted: z.boolean() }).strict(),
    "/notifications",
    { errorMessage: "Не удалось очистить уведомления." },
  );
}
