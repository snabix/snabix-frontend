import type { ReactNode, SelectHTMLAttributes } from "react";

export function ListingFormField({
  children,
  error,
  label,
}: {
  children: ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-[var(--brand-deep)]">{label}</span>
      {children}
      {error ? (
        <p className="text-sm font-semibold text-[var(--danger)]">{error}</p>
      ) : null}
    </label>
  );
}

export function ListingFormSelect({
  children,
  disabled,
  onChange,
  value,
  ...props
}: {
  children: ReactNode;
  disabled?: boolean;
  onChange: (value: string) => void;
  value: number | string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "children" | "disabled" | "onChange" | "value">) {
  return (
    <select
      className="h-12 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 text-sm text-[var(--brand-deep)] outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)] disabled:opacity-60"
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      value={value}
      {...props}
    >
      {children}
    </select>
  );
}
