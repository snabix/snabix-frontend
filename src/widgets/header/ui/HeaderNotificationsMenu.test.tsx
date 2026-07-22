import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HeaderNotificationsMenu } from "./HeaderNotificationsMenu";

const {
  deleteAllNotificationsMock,
  deleteNotificationMock,
  listNotificationsMock,
  markAllNotificationsReadMock,
  markNotificationReadMock,
  toastErrorMock,
} = vi.hoisted(() => ({
  deleteAllNotificationsMock: vi.fn(),
  deleteNotificationMock: vi.fn(),
  listNotificationsMock: vi.fn(),
  markAllNotificationsReadMock: vi.fn(),
  markNotificationReadMock: vi.fn(),
  toastErrorMock: vi.fn<(message: string) => void>(),
}));

vi.mock("@/src/entities/notification", () => ({
  deleteAllNotifications: deleteAllNotificationsMock,
  deleteNotification: deleteNotificationMock,
  listNotifications: listNotificationsMock,
  markAllNotificationsRead: markAllNotificationsReadMock,
  markNotificationRead: markNotificationReadMock,
}));

vi.mock("sonner", () => ({
  toast: {
    error: toastErrorMock,
  },
}));

const notificationFeed = {
  items: [{
    actionUrl: null,
    body: "Пользователь сохранил объявление.",
    category: "activity",
    context: {},
    createdAt: "2026-07-22T10:00:00Z",
    eventKey: "listing.favorite.created",
    id: "notification-1",
    isRead: false,
    readAt: null,
    title: "Объявление добавили в избранное",
  }],
  unreadCount: 1,
};

describe("HeaderNotificationsMenu", () => {
  beforeEach(() => {
    deleteAllNotificationsMock.mockReset().mockResolvedValue({ deleted: true });
    deleteNotificationMock.mockReset().mockResolvedValue({ deleted: true });
    listNotificationsMock.mockReset().mockResolvedValue(notificationFeed);
    markAllNotificationsReadMock.mockReset().mockResolvedValue({ markedRead: true });
    markNotificationReadMock.mockReset().mockResolvedValue(notificationFeed.items[0]);
    toastErrorMock.mockReset();
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: true,
    });
  });

  it("handles failed mutations without an unhandled rejection", async () => {
    const unhandledRejection = vi.fn();
    markAllNotificationsReadMock.mockRejectedValue(new Error("Server unavailable"));
    window.addEventListener("unhandledrejection", unhandledRejection);

    render(<HeaderNotificationsMenu isEnabled />);
    await waitFor(() => {
      expect(listNotificationsMock).toHaveBeenCalledTimes(1);
    });

    fireEvent.pointerDown(screen.getByRole("button", { name: "Уведомления" }), {
      button: 0,
      ctrlKey: false,
    });

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        "Не удалось отметить уведомления прочитанными.",
      );
    });

    expect(unhandledRejection).not.toHaveBeenCalled();
    window.removeEventListener("unhandledrejection", unhandledRejection);
  });
});
