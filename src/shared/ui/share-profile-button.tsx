"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

type ShareProfileButtonProps = {
  label?: string;
  path: string;
  text?: string;
  title: string;
};

export function ShareProfileButton({
  label = "Поделиться профилем",
  path,
  text,
  title,
}: ShareProfileButtonProps) {
  const handleShare = async () => {
    const url = new URL(path, window.location.origin).toString();
    const shareData = {
      text,
      title,
      url,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData) !== false) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(url);
      toast.success("Ссылка на профиль скопирована.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      toast.error("Не удалось поделиться профилем.");
    }
  };

  return (
    <button
      aria-label={label}
      className="inline-grid size-11 place-items-center rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] text-[var(--brand-deep)] shadow-sm transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
      onClick={() => void handleShare()}
      title={label}
      type="button"
    >
      <Share2 aria-hidden="true" size={18} />
    </button>
  );
}
