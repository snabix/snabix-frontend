type ListingDetailsStatusCardProps = {
  expiresAt: string;
  publishedAt: string;
  statusLabel: string;
};

export function ListingDetailsStatusCard({ expiresAt, publishedAt, statusLabel }: ListingDetailsStatusCardProps) {
  return (
    <aside className="rounded-[32px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] p-6 shadow-[var(--shadow-card)] sm:p-7">
      <h2 className="text-[1.6rem] font-black text-[var(--brand-deep)]">Статус и сроки</h2>
      <div className="mt-6 grid gap-4">
        <StatusMetric
          accent
          label="Статус"
          value={statusLabel}
        />
        <div className="h-px bg-[var(--border-soft)]" />
        <StatusMetric label="Размещено" value={publishedAt} />
        <div className="h-px bg-[var(--border-soft)]" />
        <StatusMetric label="Действует до" value={expiresAt} />
      </div>
    </aside>
  );
}

function StatusMetric({
  accent = false,
  label,
  value,
}: {
  accent?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
      <div className="mt-3 flex items-center gap-2">
        {accent ? <span className="size-2.5 rounded-full bg-[#47C266]" /> : null}
        <p className="text-sm font-semibold text-[var(--brand-deep)]">{value}</p>
      </div>
    </div>
  );
}
