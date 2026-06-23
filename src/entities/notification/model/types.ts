export type NotificationCategory = "listings" | "messages" | "activity" | "system";

export type NotificationPreference = {
  key: string;
  category: NotificationCategory;
  title: string;
  description: string;
  siteEnabled: boolean;
  emailEnabled: boolean;
  isRequired: boolean;
};

export type UserNotification = {
  id: string;
  eventKey: string;
  category: NotificationCategory;
  title: string;
  body: string;
  actionUrl: string | null;
  context: Record<string, unknown>;
  isRead: boolean;
  createdAt: string | null;
  readAt: string | null;
};

export type NotificationFeed = {
  items: UserNotification[];
  unreadCount: number;
};
