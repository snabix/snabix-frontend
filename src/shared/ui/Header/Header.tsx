"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { App, Avatar, Button, Dropdown, type MenuProps } from "antd";
import { LogOut, Moon, Sun, UserRound } from "lucide-react";
import { useTheme } from "next-themes";
import { getUserFullName, useUserStore } from "@/src/entities/user";
import { logout } from "@/src/features/auth/api";
import { publicNavigation } from "@/src/shared/config/navigation";
import { removeAccessToken } from "@/src/shared/lib/access-token";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { Container } from "@/src/shared/ui/container";
import { Logo } from "@/src/shared/ui/logo";

export function Header() {
  const router = useRouter();
  const { message } = App.useApp();
  const { setTheme } = useTheme();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const [isPending, startTransition] = useTransition();
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const userName = getUserFullName(user);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollYRef.current;

      setIsHeaderHidden(isScrollingDown && currentScrollY > 96);
      lastScrollYRef.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      className={[
        "sticky top-0 z-40 px-3 pt-3 sm:px-4",
        "bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_92%,var(--brand)_8%),color-mix(in_srgb,var(--background)_76%,transparent))]",
        "transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
        isHeaderHidden ? "-translate-y-[120%]" : "translate-y-0",
      ].join(" ")}
    >
      <Container>
        <div className="surface-card flex items-center justify-between gap-4 rounded-[30px] px-4 py-4 sm:px-6">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                className="nav-link interactive-lift rounded-full px-4 py-3 text-sm font-semibold hover:bg-[var(--accent-soft)]"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <button
                    aria-label="Открыть меню пользователя"
                    className="interactive-lift grid size-12 place-items-center rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] shadow-[0_14px_28px_rgba(0,70,67,0.12)] outline-none hover:border-[var(--accent)] focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
                    type="button"
                  >
                    <Avatar
                      className="!bg-[linear-gradient(135deg,var(--brand),var(--accent))] !font-bold"
                      src={user.avatar?.url ?? undefined}
                      size={42}
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
    </header>
  );
}
