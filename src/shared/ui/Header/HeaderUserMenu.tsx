"use client";

import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";
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
  onLogout: () => void;
  user: User;
};

export function HeaderUserMenu({
  isPending,
  onLogout,
  user,
}: HeaderUserMenuProps) {
  const userName = getUserFullName(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Открыть меню пользователя"
          className="grid h-[50px] w-[50px] place-items-center rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] shadow-[var(--shadow-card)] outline-none hover:border-[var(--accent)] focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
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

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link className="flex items-center gap-2" href="/account/profile">
            <UserRound size={16} />
            <span>Профиль</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-[var(--danger)] focus:text-[var(--danger)]"
          disabled={isPending}
          onClick={onLogout}
        >
          <LogOut size={16} />
          <span>Выход</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
