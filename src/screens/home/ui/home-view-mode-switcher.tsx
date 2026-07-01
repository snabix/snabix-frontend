import { LayoutGrid, List } from "lucide-react";

type HomeViewModeSwitcherProps = {
  onChangeAction: (value: "grid" | "list") => void;
  value: "grid" | "list";
};

export function HomeViewModeSwitcher({
  onChangeAction,
  value,
}: HomeViewModeSwitcherProps) {
  return (
    <div className="flex w-fit rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] p-1">
      <button
        aria-label="Показать объявления сеткой"
        className={[
          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition-colors",
          value === "grid"
            ? "bg-[var(--active-button-bg)] text-[var(--active-button-text)]"
            : "text-[var(--text-muted)] hover:text-[var(--brand-deep)]",
        ].join(" ")}
        onClick={() => onChangeAction("grid")}
        type="button"
      >
        <LayoutGrid size={16} />
      </button>

      <button
        aria-label="Показать объявления списком"
        className={[
          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition-colors",
          value === "list"
            ? "bg-[var(--active-button-bg)] text-[var(--active-button-text)]"
            : "text-[var(--text-muted)] hover:text-[var(--brand-deep)]",
        ].join(" ")}
        onClick={() => onChangeAction("list")}
        type="button"
      >
        <List size={16} />
      </button>
    </div>
  );
}
