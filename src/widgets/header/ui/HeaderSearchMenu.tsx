"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

type HeaderSearchMenuProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function HeaderSearchMenu({
  isOpen,
  onOpenChange,
}: HeaderSearchMenuProps) {
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    inputRef.current?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onOpenChange]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className={[
        "relative min-w-0 transition-all duration-300 ease-out",
        isOpen
          ? "absolute right-0 top-0 z-20 w-[min(78vw,320px)] sm:static sm:w-[min(36vw,420px)] sm:min-w-[240px]"
          : "w-11",
      ].join(" ")}
      ref={rootRef}
    >
      <button
        aria-expanded={isOpen}
        aria-label="Открыть поиск"
        className={[
          "grid size-11 place-items-center rounded-[var(--radius-control)] border border-[var(--border-soft)]",
          "bg-[var(--surface)] text-[var(--brand-deep)] transition",
          "hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]",
          isOpen ? "hidden" : "",
        ].join(" ")}
        onClick={() => onOpenChange(true)}
        type="button"
      >
        <Search size={18} />
      </button>

      {isOpen ? (
        <div className="relative min-w-0">
          <form
            className="flex h-12 items-center gap-3 rounded-[var(--radius-control)] border-2 border-[var(--focus-ring)] bg-[var(--surface)] px-4 text-[var(--brand-deep)] shadow-sm transition"
            onSubmit={handleSubmit}
          >
            <Search className="shrink-0 text-[var(--text-muted)]" size={18} />
            <input
              aria-label="Поиск объявлений"
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[var(--text-muted)]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск"
              ref={inputRef}
              type="search"
              value={query}
            />
            {query.length > 0 ? (
              <button
                aria-label="Очистить поиск"
                className="grid size-8 place-items-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--surface)] hover:text-[var(--brand-deep)]"
                onClick={() => setQuery("")}
                type="button"
              >
                <X size={15} />
              </button>
            ) : null}
          </form>

          <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-full rounded-[var(--radius-surface)] border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-4 shadow-[var(--shadow-soft)]">
            <h2 className="font-heading text-lg font-black text-[var(--brand-deep)]">
              Недавние поисковые запросы
            </h2>
          </div>
        </div>
      ) : null}
    </div>
  );
}
