"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { useAppTheme } from "@/src/shared/ui/theme-switcher/theme-context";

export function AppToaster() {
    const { resolvedTheme } = useAppTheme();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsMounted(true));

        return () => cancelAnimationFrame(frame);
    }, []);

    if (!isMounted) {
        return null;
    }

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
                        "dark:!bg-[color-mix(in_srgb,var(--surface)_88%,var(--foreground))]",
                        "!px-4 !py-3",
                        "!shadow-[var(--shadow-card)]",
                        "dark:!shadow-[var(--shadow-card)]",
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
                        "!border-[var(--border-soft)]",
                        "!bg-[color-mix(in_srgb,var(--surface)_90%,var(--accent-soft))]",

                        "[&_[data-icon]]:!bg-[var(--accent-soft)]",
                        "[&_[data-icon]]:!border-[var(--border-soft)]",
                        "[&_[data-icon]]:!text-[var(--accent)]",
                        "[&_[data-icon]]:!shadow-[var(--shadow-card)]",

                        "[&_[data-icon]_svg]:!stroke-[var(--accent)]",
                    ].join(" "),

                    error: [
                        "!border-[var(--border-soft)]",
                        "!bg-[color-mix(in_srgb,var(--surface)_88%,var(--accent-soft))]",

                        "[&_[data-icon]]:!bg-[var(--accent-soft)]",
                        "[&_[data-icon]]:!border-[var(--border-soft)]",
                        "[&_[data-icon]]:!text-[var(--accent)]",
                        "[&_[data-icon]]:!shadow-[var(--shadow-card)]",

                        "[&_[data-icon]_svg]:!stroke-[var(--accent)]",
                    ].join(" "),

                    warning: [
                        "!border-[var(--border-soft)]",
                        "!bg-[color-mix(in_srgb,var(--surface)_88%,var(--accent-soft))]",

                        "[&_[data-icon]]:!bg-[var(--accent-soft)]",
                        "[&_[data-icon]]:!border-[var(--border-soft)]",
                        "[&_[data-icon]]:!text-[var(--accent)]",
                        "[&_[data-icon]]:!shadow-[var(--shadow-card)]",

                        "[&_[data-icon]_svg]:!stroke-[var(--accent)]",
                    ].join(" "),

                    info: [
                        "!border-[var(--border-soft)]",
                        "!bg-[color-mix(in_srgb,var(--surface)_88%,var(--accent-soft))]",

                        "[&_[data-icon]]:!bg-[var(--accent-soft)]",
                        "[&_[data-icon]]:!border-[var(--border-soft)]",
                        "[&_[data-icon]]:!text-[var(--accent)]",
                        "[&_[data-icon]]:!shadow-[var(--shadow-card)]",

                        "[&_[data-icon]_svg]:!stroke-[var(--accent)]",
                    ].join(" "),
                },

                style: {
                    borderRadius: "18px",
                },
            }}
        />
    );
}
