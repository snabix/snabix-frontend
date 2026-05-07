import { create } from "zustand";
import { User } from "./types";

interface UserState {
  user: User | null;
  isLoading: boolean;
  hasCheckedSession: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setLoading: (isLoading: boolean) => void;
  setHasCheckedSession: (hasCheckedSession: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  hasCheckedSession: false,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setHasCheckedSession: (hasCheckedSession) => set({ hasCheckedSession }),
}));
