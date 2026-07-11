"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Camera, Search, X } from "lucide-react";

const recentQueries = [
  { accent: "bg-[#E7F0FF]", image: "Б", label: "Бетон М300" },
  { accent: "bg-[#F2EFE6]", image: "М", label: "Аренда манипулятора" },
  { accent: "bg-[#F7E2D1]", image: "К", label: "Кирпич облицовочный" },
  { accent: "bg-[#E6F4EA]", image: "Щ", label: "Доставка щебня" },
  { accent: "bg-[#F4E7FA]", image: "И", label: "Инструмент для ремонта" },
  { accent: "bg-[#FFE7EA]", image: "О", label: "Окна и двери" },
  { accent: "bg-[#E7F7F5]", image: "С", label: "Сухие смеси" },
  { accent: "bg-[#FFF0D8]", image: "Г", label: "Грузчики" },
];

type HeaderSearchMenuProps = {
  isOpen: boolean;
  onOpenChangeAction: (isOpen: boolean) => void;
};

export function HeaderSearchMenu({
  isOpen,
  onOpenChangeAction,
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
        onOpenChangeAction(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChangeAction(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onOpenChangeAction]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="relative min-w-0 flex-1" ref={rootRef}>
      <button
        aria-expanded={isOpen}
        aria-label="Открыть поиск"
        className={[
          "grid size-11 place-items-center rounded-2xl border border-[var(--border-soft)]",
          "bg-[var(--surface)] text-[var(--brand-deep)] transition",
          "hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]",
          isOpen ? "hidden" : "",
        ].join(" ")}
        onClick={() => onOpenChangeAction(true)}
        type="button"
      >
        <Search size={18} />
      </button>

      {isOpen ? (
        <div className="relative min-w-0">
          <form
            className="flex h-12 items-center gap-3 rounded-full border-4 border-[#7ABFFF] bg-[var(--surface-muted)] px-5 text-[var(--brand-deep)] shadow-sm transition"
            onSubmit={handleSubmit}
          >
            <Search className="shrink-0 text-[var(--text-muted)]" size={18} />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[var(--text-muted)]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск"
              ref={inputRef}
              type="search"
              value={query}
            />
            <button
              aria-label="Визуальный поиск"
              className="grid size-9 shrink-0 place-items-center rounded-full text-[var(--brand-deep)] transition hover:bg-[var(--surface)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
              type="button"
            >
              <Camera size={20} />
            </button>
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

          <div className="absolute left-0 top-[calc(100%+1rem)] z-50 w-[min(calc(100vw-2rem),980px)] rounded-b-[28px] bg-[var(--surface)] px-8 py-7 shadow-[var(--shadow-soft)]">
            <h2 className="font-heading text-2xl font-black text-[var(--brand-deep)]">
              Недавние поисковые запросы
            </h2>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {recentQueries.map((recentQuery) => (
                <button
                  className="group flex min-w-0 items-center gap-4 rounded-[22px] bg-[var(--surface-muted)] p-2 text-left text-lg font-bold text-[var(--brand-deep)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] hover:shadow-[var(--shadow-card)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
                  key={recentQuery.label}
                  onClick={() => setQuery(recentQuery.label)}
                  type="button"
                >
                  <span
                    className={`grid size-16 shrink-0 place-items-center rounded-[18px] text-xl font-black text-[var(--brand-deep)] ${recentQuery.accent}`}
                  >
                    {recentQuery.image}
                  </span>
                  <span className="min-w-0 truncate">{recentQuery.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
