"use client";

import Link from "next/link";
import { LogOut, MessageSquareText, Settings, Store, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getUserFullName, type User } from "@/src/entities/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/ui/shadcn/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/shared/ui/shadcn/dropdown-menu";

type HeaderUserMenuProps = {
  isPending: boolean;
  onLogoutAction: () => void;
  user: User;
};

const userMenuItems = [
  { href: "/account/profile", icon: UserRound, label: "Профиль" },
  { href: "/account/listings", icon: Store, label: "Мои объявления" },
  { href: "/account/reviews", icon: MessageSquareText, label: "Мои отзывы" },
  { href: "/account/settings", icon: Settings, label: "Настройки" },
];

export function HeaderUserMenu({
  isPending,
  onLogoutAction,
  user,
}: HeaderUserMenuProps) {
  const userName = getUserFullName(user);
  const [isOpen, setIsOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current === null) {
      return;
    }

    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };

  const openMenu = () => {
    clearCloseTimer();
    setIsOpen(true);
  };

  const scheduleCloseMenu = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      closeTimerRef.current = null;
    }, 160);
  };

  useEffect(() => () => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
    }
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Открыть меню пользователя"
          className="grid h-[50px] w-[50px] place-items-center rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] shadow-[var(--shadow-card)] outline-none hover:border-[var(--accent)] focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
          onPointerEnter={openMenu}
          onPointerLeave={scheduleCloseMenu}
          type="button"
        >
          <Avatar className="size-11 font-bold">
            <AvatarImage src={user.avatar?.url ?? undefined} />
            <AvatarFallback>
              {userName.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="user-dropdown-content"
        onPointerEnter={openMenu}
        onPointerLeave={scheduleCloseMenu}
      >
        {userMenuItems.map(({ href, icon: Icon, label }) => (
          <DropdownMenuItem asChild key={href}>
            <Link className="flex items-center gap-2" href={href}>
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-[var(--danger)] focus:text-[var(--danger)]"
          disabled={isPending}
          onClick={onLogoutAction}
        >
          <LogOut size={16} />
          <span>Выход</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
