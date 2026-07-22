import { create } from "zustand";
import { setAuthSessionHint } from "@/src/shared/api/auth-session-hint";
import { User } from "./types";

export type SessionStatus = "unknown" | "checking" | "authenticated" | "guest" | "expired";
export type SessionEndReason = "unauthenticated" | "csrf-token-mismatch" | "signed-out";

interface UserState {
  user: User | null;
  isLoading: boolean;
  hasCheckedSession: boolean;
  sessionStatus: SessionStatus;
  sessionEndReason: SessionEndReason | null;
  setUser: (user: User | null) => void;
  clearUser: (reason?: SessionEndReason) => void;
  setLoading: (isLoading: boolean) => void;
  setHasCheckedSession: (hasCheckedSession: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  hasCheckedSession: false,
  sessionStatus: "unknown",
  sessionEndReason: null,
  setUser: (user) => {
    setAuthSessionHint(user !== null);
    set({
      user,
      isLoading: false,
      hasCheckedSession: true,
      sessionStatus: user ? "authenticated" : "guest",
      sessionEndReason: null,
    });
  },
  clearUser: (reason = "unauthenticated") => {
    setAuthSessionHint(false);
    set({
      user: null,
      isLoading: false,
      hasCheckedSession: true,
      sessionStatus: reason === "signed-out" ? "guest" : "expired",
      sessionEndReason: reason,
    });
  },
  setLoading: (isLoading) => set((state) => ({
    isLoading,
    sessionStatus: isLoading ? "checking" : state.sessionStatus,
  })),
  setHasCheckedSession: (hasCheckedSession) => set((state) => ({
    hasCheckedSession,
    sessionStatus: !hasCheckedSession
      ? "unknown"
      : state.sessionStatus === "unknown"
        ? state.user ? "authenticated" : "guest"
        : state.sessionStatus,
  })),
}));
