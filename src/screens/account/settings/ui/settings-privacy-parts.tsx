import { Eye, EyeOff, Pencil } from "lucide-react";
import { formatPhoneNumber } from "@/src/shared/lib/format-phone-number";

export function PrivacyDataRow({
  isVisible,
  label,
  maskedValue,
  onEditAction,
  onToggleAction,
  value,
}: {
  isVisible: boolean;
  label: string;
  maskedValue: string;
  onEditAction: () => void;
  onToggleAction: () => void;
  value: string;
}) {
  const VisibilityIcon = isVisible ? EyeOff : Eye;

  return (
    <div className="flex items-center justify-between gap-4 py-5">
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-black text-[var(--brand-deep)]">
          {isVisible ? value : maskedValue}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          aria-label={isVisible ? `Скрыть ${label}` : `Показать ${label}`}
          className="grid size-10 place-items-center rounded-full border border-[var(--border-soft)] text-[var(--brand-deep)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
          onClick={onToggleAction}
          type="button"
        >
          <VisibilityIcon size={17} />
        </button>
        <button
          aria-label={`Редактировать ${label}`}
          className="grid size-10 place-items-center rounded-full border border-[var(--border-soft)] text-[var(--brand-deep)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
          onClick={onEditAction}
          type="button"
        >
          <Pencil size={16} />
        </button>
      </div>
    </div>
  );
}

export function maskEmail(email?: string | null) {
  if (!email) {
    return "Не указан";
  }

  const [localPart, domain] = email.split("@");

  if (!domain) {
    return maskMiddle(email);
  }

  return `${maskMiddle(localPart)}@${maskMiddle(domain)}`;
}

export function maskPhone(phone?: string | null) {
  const formatted = formatPhoneNumber(phone);

  if (!formatted) {
    return "Не указан";
  }

  return formatted.replace(/\d(?=\d{2})/g, "•");
}

function maskMiddle(value: string) {
  if (value.length <= 2) {
    return "••";
  }

  return `${value.slice(0, 1)}${"•".repeat(Math.max(value.length - 2, 2))}${value.slice(-1)}`;
}
