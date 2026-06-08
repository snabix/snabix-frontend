import { LayoutGrid, X } from "lucide-react";

type CatalogToggleButtonProps = {
  isOpen: boolean;
  onToggleAction: () => void;
};

export function CatalogToggleButton({
  isOpen,
  onToggleAction,
}: CatalogToggleButtonProps) {
  return (
    <button
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      className="active-button mr-6 inline-flex h-12 items-center justify-center gap-2.5 rounded-full px-5 text-sm font-bold leading-none shadow-[var(--shadow-card)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
      onClick={onToggleAction}
      type="button"
    >
      <span className="inline-grid size-6 shrink-0 place-items-center self-center">
        {isOpen ? (
          <X
            aria-hidden="true"
            size={22}
            strokeWidth={2.2}
          />
        ) : (
          <LayoutGrid
            aria-hidden="true"
            size={22}
            strokeWidth={2.2}
          />
        )}
      </span>
      <span className="inline-flex items-center self-center">Каталог</span>
    </button>
  );
}
