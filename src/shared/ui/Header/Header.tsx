"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { App, Avatar, Button, Dropdown, type MenuProps } from "antd";
import { LayoutGrid, LogOut, Moon, Sun, UserRound, X } from "lucide-react";
import { useTheme } from "next-themes";
import { getUserFullName, useUserStore } from "@/src/entities/user";
import { logout } from "@/src/features/auth/api";
import { publicNavigation } from "@/src/shared/config/navigation";
import { removeAccessToken } from "@/src/shared/lib/access-token";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { CategoryCatalog } from "@/src/shared/ui/Header/CategoryCatalog";
import { Container } from "@/src/shared/ui/container";
import { Logo } from "@/src/shared/ui/logo";

export function Header() {
  const router = useRouter();
  const { message } = App.useApp();
  const { setTheme } = useTheme();
  const user = useUserStore((state) => state.user);
  const hasCheckedSession = useUserStore((state) => state.hasCheckedSession);
  const clearUser = useUserStore((state) => state.clearUser);
  const [isPending, startTransition] = useTransition();
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [catalogTopOffset, setCatalogTopOffset] = useState(96);
  const lastScrollYRef = useRef(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const userName = getUserFullName(user);

  useEffect(() => {
    const handleScroll = () => {
      if (isCatalogOpen) {
        setIsHeaderHidden(false);
        return;
      }

      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollYRef.current;

      setIsHeaderHidden(isScrollingDown && currentScrollY > 96);
      lastScrollYRef.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCatalogOpen]);

  useEffect(() => {
    const updateCatalogTopOffset = () => {
      const nextTopOffset = headerRef.current?.getBoundingClientRect().bottom ?? 96;

      setCatalogTopOffset(nextTopOffset);
    };

    updateCatalogTopOffset();

    window.addEventListener("resize", updateCatalogTopOffset);

    return () => window.removeEventListener("resize", updateCatalogTopOffset);
  }, []);

  useEffect(() => {
    if (!isCatalogOpen) {
      return;
    }

    const updateCatalogTopOffset = () => {
      const nextTopOffset = headerRef.current?.getBoundingClientRect().bottom ?? 96;

      setCatalogTopOffset(nextTopOffset);
    };

    updateCatalogTopOffset();

    window.addEventListener("scroll", updateCatalogTopOffset, { passive: true });
    window.addEventListener("resize", updateCatalogTopOffset);

    return () => {
      window.removeEventListener("scroll", updateCatalogTopOffset);
      window.removeEventListener("resize", updateCatalogTopOffset);
    };
  }, [isCatalogOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      removeAccessToken();
      clearUser();
      message.success("Вы вышли из аккаунта.");
      startTransition(() => {
        router.push("/");
        router.refresh();
      });
    } catch (error) {
      message.error(extractApiError(error, "Не удалось выйти из аккаунта."));
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: <Link href="/account/profile">Профиль</Link>,
      icon: <UserRound size={16} />,
    },
    {
      type: "divider",
    },
    {
      key: "theme-light",
      label: (
        <div className="flex items-center gap-2">
          <Sun size={16} className="text-[var(--foreground)]" />
          <span>Светлая тема</span>
        </div>
      ),
      onClick: () => setTheme("light"),
    },
    {
      key: "theme-dark",
      label: (
        <div className="flex items-center gap-2">
          <Moon size={16} className="text-[var(--foreground)]" />
          <span>Темная тема</span>
        </div>
      ),
      onClick: () => setTheme("dark"),
    },
    {
      key: "theme-system",
      label: (
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-full border border-current" />
          <span>Система</span>
        </div>
      ),
      onClick: () => setTheme("system"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      danger: true,
      disabled: isPending,
      label: "Выход",
      icon: <LogOut size={16} />,
      onClick: handleLogout,
    },
  ];

  return (
    <header
      ref={headerRef}
      className={[
        "sticky top-0 z-40 mb-5 px-3 pt-3 sm:mb-6 sm:px-4",
        "bg-transparent",
        "transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
        isHeaderHidden ? "-translate-y-[120%]" : "translate-y-0",
      ].join(" ")}
    >
      <Container>
        <div className="surface-card flex items-center justify-between gap-6 rounded-[30px] px-4 py-4 sm:px-6">
          <div className="flex items-center gap-5 ">
            <Logo />

            <nav className="hidden items-center gap-1 lg:flex">
            <button
              className="active-button mr-6 inline-flex h-12 items-center justify-center gap-2.5 rounded-full px-5 text-sm font-bold leading-none shadow-[0_14px_28px_rgba(0,70,67,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
              onClick={() => setIsCatalogOpen((currentState) => !currentState)}
              type="button"
            >
              <span className="relative inline-flex h-[24px] w-[24px] shrink-0 items-center justify-center self-center">
                <LayoutGrid
                  aria-hidden="true"
                  className={[
                    "absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out",
                    isCatalogOpen
                      ? "scale-75 rotate-90 opacity-0"
                      : "scale-100 rotate-0 opacity-100",
                  ].join(" ")}
                  size={22}
                />
                <X
                  aria-hidden="true"
                  className={[
                    "absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out",
                    isCatalogOpen
                      ? "scale-100 rotate-0 opacity-100"
                      : "scale-75 -rotate-90 opacity-0",
                  ].join(" ")}
                  size={22}
                />
              </span>
              <span className="inline-flex items-center self-center">Каталог</span>
            </button>

            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                className="nav-link rounded-full px-4 py-3 text-sm font-semibold hover:bg-[var(--accent-soft)]"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {!hasCheckedSession ? (
              <div className="flex items-center gap-3">
                <div className="h-11 w-28 rounded-[18px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_72%,transparent)]" />
                <div className="h-11 w-32 rounded-[18px] bg-[color-mix(in_srgb,var(--brand)_14%,transparent)]" />
              </div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <button
                    aria-label="Открыть меню пользователя"
                    className="grid h-[50px] w-[50px] place-items-center rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] shadow-[0_14px_28px_rgba(0,70,67,0.08)] outline-none hover:border-[var(--accent)] focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
                    type="button"
                  >
                    <Avatar
                      className="!bg-[linear-gradient(135deg,var(--brand),var(--accent))] !font-bold"
                      src={user.avatar?.url ?? undefined}
                      size={44}
                    >
                      {userName.slice(0, 1).toUpperCase()}
                    </Avatar>
                  </button>
                </Dropdown>
              </div>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button
                    className="header-button-secondary !h-11 !rounded-[18px] !px-5 !font-semibold"
                  >
                    Войти
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    className="active-button !h-11 !rounded-[18px] !border-none !px-5 !font-semibold"
                    type="primary"
                  >
                    Регистрация
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>

      <CategoryCatalog
        isOpen={isCatalogOpen}
        onToggle={() => setIsCatalogOpen((currentState) => !currentState)}
        topOffset={catalogTopOffset}
      />
    </header>
  );
}
