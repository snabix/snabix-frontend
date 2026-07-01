type ListingDetailsDescriptionProps = {
  description: string;
  detailPairs: Array<[string, string]>;
};

export function ListingDetailsDescription({ description, detailPairs }: ListingDetailsDescriptionProps) {
  return (
    <div className="rounded-[32px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] p-6 shadow-[var(--shadow-card)] sm:p-7">
      <h2 className="text-[1.6rem] font-black text-[var(--brand-deep)]">Описание</h2>
      <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-[var(--text-muted)]">
        {description}
      </p>

      <div className="mt-8 border-t border-[var(--border-soft)] pt-6">
        <h2 className="text-[1.6rem] font-black text-[var(--brand-deep)]">Характеристики</h2>
        <div className="mt-5 grid gap-x-10 gap-y-4 md:grid-cols-2">
          {detailPairs.map(([label, value]) => (
            <div className="grid grid-cols-[190px_minmax(0,1fr)] gap-4 border-b border-[var(--border-soft)] pb-3" key={label}>
              <span className="text-sm text-[var(--text-muted)]">{label}</span>
              <span className="text-sm font-semibold text-[var(--brand-deep)]">{value || "-"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
