"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

type AccountSidebarState = {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
};

const AccountSidebarStateContext = createContext<AccountSidebarState | null>(null);

export function AccountSidebarStateProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const value = useMemo(
    () => ({
      isCollapsed,
      setIsCollapsed,
    }),
    [isCollapsed],
  );

  return (
    <AccountSidebarStateContext.Provider value={value}>
      {children}
    </AccountSidebarStateContext.Provider>
  );
}

export function useAccountSidebarState() {
  const context = useContext(AccountSidebarStateContext);

  if (context === null) {
    return {
      isCollapsed: true,
      setIsCollapsed: () => undefined,
    };
  }

  return context;
}
