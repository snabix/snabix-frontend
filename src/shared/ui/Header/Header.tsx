"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button, message } from "antd";
import { useUserStore } from "@/src/entities/user";
import { logout } from "@/src/features/auth/api";
import { publicNavigation } from "@/src/shared/config/navigation";
import { removeAccessToken } from "@/src/shared/lib/access-token";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { Container } from "@/src/shared/ui/container";
import { Logo } from "@/src/shared/ui/logo";

export function Header() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const [isPending, startTransition] = useTransition();

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

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <Container>
        <div className="surface-card flex items-center justify-between gap-4 rounded-[30px] px-4 py-4 sm:px-6">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                className="interactive-lift rounded-full px-4 py-3 text-sm font-semibold text-[#5f6b7a] hover:bg-white/70 hover:text-[var(--brand-deep)]"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden rounded-[18px] border border-[var(--border-soft)] bg-white/70 px-4 py-2 text-right sm:block">
                  <div className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    Пользователь
                  </div>
                  <div className="font-semibold text-[var(--brand-deep)]">
                    {user.name}
                  </div>
                </div>
                <Button
                  className="!h-11 !rounded-[18px] !border-[var(--border-soft)] !px-5 !font-semibold"
                  loading={isPending}
                  onClick={handleLogout}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button
                    className="!h-11 !rounded-[18px] !border-[var(--border-soft)] !px-5 !font-semibold"
                  >
                    Войти
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    className="!h-11 !rounded-[18px] !border-none !bg-[linear-gradient(135deg,var(--brand),var(--accent))] !px-5 !font-semibold !text-white"
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
