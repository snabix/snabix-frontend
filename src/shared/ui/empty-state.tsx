import type { ReactNode } from "react";
import { SearchX, type LucideIcon } from "lucide-react";

type EmptyStateProps = {
  action?: ReactNode;
  description?: string;
  icon?: LucideIcon;
  title: string;
};

export function EmptyState({
  action,
  description,
  icon: Icon = SearchX,
  title,
}: EmptyStateProps) {
  return (
    <div className="grid min-h-56 place-items-center rounded-[26px] border border-dashed border-[var(--border-soft)] bg-[var(--surface)] p-8 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-[var(--border-soft)] bg-[var(--accent-soft)] text-[var(--brand-deep)]">
          <Icon aria-hidden="true" size={24} />
        </div>

        <p className="font-heading mt-5 text-2xl font-black text-[var(--brand-deep)]">
          {title}
        </p>

        {description ? (
          <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
            {description}
          </p>
        ) : null}

        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}
