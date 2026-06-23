"use client";

import Link from "next/link";
import {
    Heart,
    LogOut,
    MessageSquareText,
    Settings,
    Store,
    SunMoon,
    UserRound,
} from "lucide-react";
import {getUserFullName, type User} from "@/src/entities/user";
import {Avatar, AvatarFallback, AvatarImage} from "@/src/shared/ui/shadcn/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/shared/ui/shadcn/dropdown-menu";
import {ThemeSwitcher} from "@/src/shared/ui/theme-switcher/ThemeSwitcher";

type HeaderUserMenuProps = {
    isPending: boolean;
    onLogoutAction: () => void;
    user: User;
};

const userMenuItems = [
    {href: "/account/profile", icon: UserRound, label: "Профиль"},
    {href: "/account/listings", icon: Store, label: "Мои объявления"},
    {href: "/account/favorites", icon: Heart, label: "Избранное"},
    {href: "/account/reviews", icon: MessageSquareText, label: "Мои отзывы"},
];

export function HeaderUserMenu({
                                   isPending,
                                   onLogoutAction,
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
                        <AvatarImage src={user.avatar?.url ?? undefined}/>
                        <AvatarFallback>
                            {userName.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-72 p-2">
                {userMenuItems.map(({href, icon: Icon, label}) => (
                    <DropdownMenuItem asChild key={href}>
                        <Link className="flex items-center gap-3 py-2.5" href={href}>
                            <Icon size={16}/>
                            <span>{label}</span>
                        </Link>
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator/>

                <DropdownMenuItem asChild>
                    <Link className="flex items-center gap-3 py-2.5" href="/account/settings">
                        <Settings size={16}/>
                        <span>Настройки</span>
                    </Link>
                </DropdownMenuItem>

                <div className="flex items-center justify-between  rounded-xl px-3 py-2.5 text-sm">
                    <span className="flex items-center gap-3">
                        <SunMoon size={16}/>
                    <span>Тема</span>
                    </span>
                    <ThemeSwitcher compact/>
                </div>

                <DropdownMenuSeparator/>

                <DropdownMenuItem
                    className="text-[var(--danger)] focus:text-[var(--danger)]"
                    disabled={isPending}
                    onClick={onLogoutAction}
                >
                    <LogOut size={16}/>
                    <span>Выход</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
