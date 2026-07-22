import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useNotificationFeedPolling } from "./use-notification-feed-polling";

const { listNotificationsMock } = vi.hoisted(() => ({
  listNotificationsMock: vi.fn(),
}));

vi.mock("@/src/entities/notification", () => ({
  listNotifications: listNotificationsMock,
}));

const feed = {
  items: [],
  unreadCount: 0,
};

function setVisibility(value: DocumentVisibilityState) {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    value,
  });
}

function setOnline(value: boolean) {
  Object.defineProperty(navigator, "onLine", {
    configurable: true,
    value,
  });
}

async function flushPromises() {
  await act(async () => {
    await Promise.resolve();
  });
}

describe("useNotificationFeedPolling", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    listNotificationsMock.mockReset();
    listNotificationsMock.mockResolvedValue(feed);
    setVisibility("visible");
    setOnline(true);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not poll while the document is hidden and refreshes when visible", async () => {
    setVisibility("hidden");

    renderHook(() => useNotificationFeedPolling({
      isEnabled: true,
      onNewNotification: vi.fn(),
    }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5 * 60_000);
    });

    expect(listNotificationsMock).not.toHaveBeenCalled();

    setVisibility("visible");
    document.dispatchEvent(new Event("visibilitychange"));
    await flushPromises();

    expect(listNotificationsMock).toHaveBeenCalledTimes(1);
  });

  it("pauses offline and refreshes when connectivity returns", async () => {
    setOnline(false);

    renderHook(() => useNotificationFeedPolling({
      isEnabled: true,
      onNewNotification: vi.fn(),
    }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5 * 60_000);
    });

    expect(listNotificationsMock).not.toHaveBeenCalled();

    setOnline(true);
    window.dispatchEvent(new Event("online"));
    await flushPromises();

    expect(listNotificationsMock).toHaveBeenCalledTimes(1);
  });

  it("backs off after an error and returns to the base interval after recovery", async () => {
    listNotificationsMock
      .mockRejectedValueOnce(new Error("Server unavailable"))
      .mockResolvedValue(feed);

    renderHook(() => useNotificationFeedPolling({
      isEnabled: true,
      onNewNotification: vi.fn(),
    }));
    await flushPromises();

    expect(listNotificationsMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(59_999);
    });
    expect(listNotificationsMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(listNotificationsMock).toHaveBeenCalledTimes(2);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(30_000);
    });
    expect(listNotificationsMock).toHaveBeenCalledTimes(3);
  });

  it("queues a forced refresh instead of starting a concurrent request", async () => {
    let resolveInitialRequest: ((value: typeof feed) => void) | undefined;
    const initialRequest = new Promise<typeof feed>((resolve) => {
      resolveInitialRequest = resolve;
    });

    listNotificationsMock
      .mockReturnValueOnce(initialRequest)
      .mockResolvedValue(feed);

    const { result } = renderHook(() => useNotificationFeedPolling({
      isEnabled: true,
      onNewNotification: vi.fn(),
    }));

    expect(listNotificationsMock).toHaveBeenCalledTimes(1);

    act(() => result.current.refresh(true));
    expect(listNotificationsMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveInitialRequest?.(feed);
      await initialRequest;
    });

    expect(listNotificationsMock).toHaveBeenCalledTimes(2);
  });
});
