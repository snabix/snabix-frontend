"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export function AppToaster() {
    const { resolvedTheme } = useTheme();

    return (
        <Toaster
            closeButton={false}
            expand={false}
            offset={22}
            position="top-center"
            richColors={false}
            theme={resolvedTheme === "dark" ? "dark" : "light"}
            visibleToasts={3}
            toastOptions={{
                classNames: {
                    toast: [
                        "!w-[min(92vw,420px)]",
                        "!min-h-0",
                        "!flex",
                        "!items-center",
                        "!justify-center",
                        "!gap-3.5",
                        "!rounded-2xl",
                        "!border !border-[var(--border-soft)]",
                        "!bg-[color-mix(in_srgb,var(--surface)_94%,transparent)]",
                        "dark:!bg-[color-mix(in_srgb,var(--surface)_88%,#02060e)]",
                        "!px-4 !py-3",
                        "!shadow-[0_18px_42px_rgba(0,70,67,0.14)]",
                        "dark:!shadow-[0_18px_42px_rgba(0,0,0,0.24)]",
                        "!backdrop-blur-xl",
                    ].join(" "),

                    content: [
                        "!flex",
                        "!min-w-0",
                        "!flex-1",
                        "!flex-col",
                        "!items-center",
                        "!justify-center",
                        "!gap-0.5",
                        "!text-center",
                    ].join(" "),

                    icon: [
                        "!my-0",
                        "!ml-0",
                        "!mr-0.5",
                        "!flex",
                        "!h-9",
                        "!w-9",
                        "!shrink-0",
                        "!items-center",
                        "!justify-center",
                        "!self-center",
                        "!rounded-full",
                        "!border",
                        "!p-0",
                        "[&_svg]:!m-0",
                        "[&_svg]:!h-4",
                        "[&_svg]:!w-4",
                        "[&_svg]:!shrink-0",
                        "[&_svg]:!self-center",
                    ].join(" "),

                    title: [
                        "!m-0",
                        "!text-center",
                        "!text-sm",
                        "!font-bold",
                        "!leading-5",
                        "!tracking-[-0.01em]",
                        "!text-[var(--brand-deep)]",
                    ].join(" "),

                    description: [
                        "!m-0",
                        "!mt-0.5",
                        "!text-center",
                        "!text-xs",
                        "!font-medium",
                        "!leading-5",
                        "!text-[var(--text-muted)]",
                    ].join(" "),

                    success: [
                        "!border-emerald-500/20",
                        "!bg-[color-mix(in_srgb,var(--surface)_94%,#10b981_6%)]",
                        "dark:!bg-[color-mix(in_srgb,var(--surface)_86%,#10b981_10%)]",

                        "[&_[data-icon]]:!bg-emerald-500/12",
                        "[&_[data-icon]]:!border-emerald-500/20",
                        "[&_[data-icon]]:!text-emerald-600",
                        "[&_[data-icon]]:dark:!text-emerald-400",
                        "[&_[data-icon]]:!shadow-[0_8px_18px_rgba(16,185,129,0.18)]",

                        "[&_[data-icon]_svg]:!stroke-emerald-600",
                        "[&_[data-icon]_svg]:dark:!stroke-emerald-400",
                    ].join(" "),

                    error: [
                        "!border-red-500/20",
                        "!bg-[color-mix(in_srgb,var(--surface)_94%,#ef4444_6%)]",
                        "dark:!bg-[color-mix(in_srgb,var(--surface)_86%,#ef4444_10%)]",

                        "[&_[data-icon]]:!bg-red-500/12",
                        "[&_[data-icon]]:!border-red-500/20",
                        "[&_[data-icon]]:!text-red-600",
                        "[&_[data-icon]]:dark:!text-red-400",
                        "[&_[data-icon]]:!shadow-[0_8px_18px_rgba(239,68,68,0.16)]",

                        "[&_[data-icon]_svg]:!stroke-red-600",
                        "[&_[data-icon]_svg]:dark:!stroke-red-400",
                    ].join(" "),

                    warning: [
                        "!border-amber-500/20",
                        "!bg-[color-mix(in_srgb,var(--surface)_94%,#f59e0b_7%)]",
                        "dark:!bg-[color-mix(in_srgb,var(--surface)_86%,#f59e0b_10%)]",

                        "[&_[data-icon]]:!bg-amber-500/12",
                        "[&_[data-icon]]:!border-amber-500/20",
                        "[&_[data-icon]]:!text-amber-600",
                        "[&_[data-icon]]:dark:!text-amber-400",
                        "[&_[data-icon]]:!shadow-[0_8px_18px_rgba(245,158,11,0.16)]",

                        "[&_[data-icon]_svg]:!stroke-amber-600",
                        "[&_[data-icon]_svg]:dark:!stroke-amber-400",
                    ].join(" "),

                    info: [
                        "!border-sky-500/20",
                        "!bg-[color-mix(in_srgb,var(--surface)_94%,#0ea5e9_6%)]",
                        "dark:!bg-[color-mix(in_srgb,var(--surface)_86%,#0ea5e9_10%)]",

                        "[&_[data-icon]]:!bg-sky-500/12",
                        "[&_[data-icon]]:!border-sky-500/20",
                        "[&_[data-icon]]:!text-sky-600",
                        "[&_[data-icon]]:dark:!text-sky-400",
                        "[&_[data-icon]]:!shadow-[0_8px_18px_rgba(14,165,233,0.16)]",

                        "[&_[data-icon]_svg]:!stroke-sky-600",
                        "[&_[data-icon]_svg]:dark:!stroke-sky-400",
                    ].join(" "),
                },

                style: {
                    borderRadius: "18px",
                },
            }}
        />
    );
}
