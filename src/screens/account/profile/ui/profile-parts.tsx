"use client";

import type { ReactNode } from "react";
import {
  CheckCircle2,
  type LucideIcon,
  UserRound,
  XCircle,
} from "lucide-react";

export function EmailVerificationBadge({ verified }: { verified: boolean }) {
  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold",
        verified
          ? "bg-[var(--accent-soft)] text-[var(--accent)]"
          : "bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)] text-[var(--brand-deep)]",
      ].join(" ")}
    >
      {verified ? (
        <CheckCircle2 aria-hidden="true" size={15} />
      ) : (
        <XCircle aria-hidden="true" size={15} />
      )}

      {verified ? "Email подтвержден" : "Email не подтвержден"}
    </div>
  );
}

export function ProfileStatusPill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "danger" | "accent";
}) {
  const toneClassName = {
    accent: "bg-[var(--accent-soft)] text-[var(--accent)]",
    danger: "bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)] text-[var(--brand-deep)]",
    neutral: "bg-[color-mix(in_srgb,var(--surface)_80%,transparent)] text-[var(--text-muted)]",
    success: "bg-[var(--accent-soft)] text-[var(--accent)]",
  }[tone];

  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold",
        toneClassName,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function ProfileDataField({
  children,
  label,
  icon: Icon,
  value,
  empty = "Не указано",
}: {
  children?: ReactNode;
  label: string;
  icon: LucideIcon;
  value?: string | null;
  empty?: string;
}) {
  return (
    <div className="profile-data-field rounded-[26px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-1.5">
          <p className="font-heading text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {label}
          </p>

          {children ?? (
            <p className="text-base font-extrabold leading-6 text-[var(--brand-deep)]">
              {value && value.trim() !== "" ? value : empty}
            </p>
          )}
        </div>

        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <Icon aria-hidden="true" size={18} />
        </div>
      </div>
    </div>
  );
}

export function ProfileEditField({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="grid gap-2">
      <p className="pl-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {label}
      </p>

      {children}
    </div>
  );
}

export function ProfileSectionHeader() {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <UserRound aria-hidden="true" size={20} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Персональные данные
          </p>

          <h2 className="font-heading mt-1 text-2xl font-extrabold text-[var(--brand-deep)]">
            Основная информация
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Ключевые контакты и детали аккаунта, которые видны вам и помогают держать профиль в порядке.
          </p>
        </div>
      </div>
    </div>
  );
}
