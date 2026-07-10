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
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold",
        verified
          ? "border-[color-mix(in_srgb,var(--accent)_42%,var(--border-soft))] bg-[var(--accent-soft)] text-[var(--brand-deep)]"
          : "border-[color-mix(in_srgb,var(--danger)_42%,var(--border-soft))] bg-[var(--danger-soft)] text-[var(--danger)]",
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
    accent: "border-[color-mix(in_srgb,var(--accent)_42%,var(--border-soft))] bg-[var(--accent-soft)] text-[var(--brand-deep)]",
    danger: "border-[color-mix(in_srgb,var(--danger)_42%,var(--border-soft))] bg-[var(--danger-soft)] text-[var(--danger)]",
    neutral: "border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_80%,transparent)] text-[var(--brand-deep)]",
    success: "border-[color-mix(in_srgb,var(--accent)_42%,var(--border-soft))] bg-[var(--accent-soft)] text-[var(--brand-deep)]",
  }[tone];

  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold",
        toneClassName,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function ProfileDataField({
  children,
  className,
  label,
  icon: Icon,
  value,
  empty = "Не указано",
}: {
  children?: ReactNode;
  className?: string;
  label: string;
  icon: LucideIcon;
  value?: string | null;
  empty?: string;
}) {
  return (
    <div
      className={[
        "profile-data-field border-b border-[var(--border-soft)] px-1 py-4 last:border-b-0",
        className,
      ].filter(Boolean).join(" ")}
    >
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

        <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
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
        </div>
      </div>
    </div>
  );
}
