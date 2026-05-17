"use client";

import { LayoutGrid, X } from "lucide-react";

type CatalogToggleButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function CatalogToggleButton({
  isOpen,
  onToggle,
}: CatalogToggleButtonProps) {
  return (
    <button
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      className="active-button mr-6 inline-flex h-12 items-center justify-center gap-2.5 rounded-full px-5 text-sm font-bold leading-none shadow-[0_14px_28px_rgba(0,70,67,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
      onClick={onToggle}
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
