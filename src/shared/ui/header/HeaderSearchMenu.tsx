"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Clock3, Search, X } from "lucide-react";

const recentQueries = [
  "Бетон М300",
  "Аренда манипулятора",
  "Кирпич облицовочный",
  "Доставка щебня",
];

export function HeaderSearchMenu() {
  const [isOpen, setIsOpen] = useState(false);
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
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        aria-expanded={isOpen}
        aria-label="Открыть поиск"
        className="grid size-11 place-items-center rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] text-[var(--brand-deep)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <Search size={18} />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(86vw,390px)] overflow-hidden rounded-[26px] border border-[var(--border-soft)] bg-[var(--surface)] p-3 shadow-[var(--shadow-soft)]">
          <form
            className="flex items-center gap-2 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-muted)] px-3 py-2.5 text-[var(--brand-deep)] transition focus-within:border-[var(--accent)] focus-within:ring-4 focus-within:ring-[var(--accent-soft)]"
            onSubmit={handleSubmit}
          >
            <Search className="shrink-0 text-[var(--text-muted)]" size={18} />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[var(--text-muted)]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Найти товары, услуги или категории"
              ref={inputRef}
              type="search"
              value={query}
            />
            {query.length > 0 ? (
              <button
                aria-label="Очистить поиск"
                className="grid size-7 place-items-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--brand-deep)]"
                onClick={() => setQuery("")}
                type="button"
              >
                <X size={15} />
              </button>
            ) : null}
          </form>

          <div className="mt-4">
            <div className="px-1 text-xs font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Недавние запросы
            </div>

            <div className="mt-2 flex flex-col">
              {recentQueries.map((recentQuery) => (
                <button
                  className="flex items-center gap-3 rounded-2xl px-2 py-2.5 text-left text-sm font-bold text-[var(--brand-deep)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
                  key={recentQuery}
                  onClick={() => setQuery(recentQuery)}
                  type="button"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--surface-muted)] text-[var(--text-muted)]">
                    <Clock3 size={15} />
                  </span>
                  <span className="min-w-0 truncate">{recentQuery}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
