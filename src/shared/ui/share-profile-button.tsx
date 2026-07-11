"use client";

import { useState } from "react";
import {
  Copy,
  Mail,
  MessageCircle,
  Send,
  Share2,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/src/shared/ui/shadcn/dialog";

type ShareProfileButtonProps = {
  label?: string;
  path: string;
  text?: string;
  title: string;
};

type ShareTarget = {
  icon: "facebook" | "mail" | "native" | "telegram" | "vk" | "whatsapp" | "x";
  label: string;
  tone: string;
  type: "email" | "facebook" | "native" | "telegram" | "vk" | "whatsapp" | "x";
};

const shareTargets: ShareTarget[] = [
  {
    icon: "native",
    label: "Системно",
    tone: "bg-[var(--brand-deep)] text-white",
    type: "native",
  },
  {
    icon: "telegram",
    label: "Telegram",
    tone: "bg-[#2AABEE] text-white",
    type: "telegram",
  },
  {
    icon: "whatsapp",
    label: "WhatsApp",
    tone: "bg-[#25D366] text-white",
    type: "whatsapp",
  },
  {
    icon: "vk",
    label: "VK",
    tone: "bg-[#0077FF] text-white",
    type: "vk",
  },
  {
    icon: "facebook",
    label: "Facebook",
    tone: "bg-[#1877F2] text-white",
    type: "facebook",
  },
  {
    icon: "x",
    label: "X",
    tone: "bg-black text-white",
    type: "x",
  },
  {
    icon: "mail",
    label: "Email",
    tone: "bg-[var(--accent-soft)] text-[var(--brand-deep)]",
    type: "email",
  },
];

export function ShareProfileButton({
  label = "Поделиться профилем",
  path,
  text,
  title,
}: ShareProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");

  const resolveProfileUrl = () => new URL(path, window.location.origin).toString();

  const buildShareTargetUrl = (type: ShareTarget["type"]) => {
    const profileUrl = resolveProfileUrl();
    const encodedUrl = encodeURIComponent(profileUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedBody = encodeURIComponent(`${text ?? title}\n\n${profileUrl}`);

    if (type === "telegram") {
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
    }

    if (type === "whatsapp") {
      return `https://wa.me/?text=${encodedBody}`;
    }

    if (type === "vk") {
      return `https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}`;
    }

    if (type === "facebook") {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    }

    if (type === "x") {
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    }

    return `mailto:?subject=${encodedTitle}&body=${encodedBody}`;
  };

  const handleNativeShare = async () => {
    const url = resolveProfileUrl();
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

  const handleOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen);

    if (nextOpen) {
      setProfileUrl(resolveProfileUrl());
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(resolveProfileUrl());
      toast.success("Ссылка на профиль скопирована.");
    } catch {
      toast.error("Не удалось скопировать ссылку.");
    }
  };

  const handleShareTarget = (type: ShareTarget["type"]) => {
    if (type === "native") {
      void handleNativeShare();
      return;
    }

    const targetUrl = buildShareTargetUrl(type);

    if (type === "email") {
      window.open(targetUrl, "_self");
      return;
    }

    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <button
        aria-label={label}
        className="inline-grid size-11 place-items-center rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] text-[var(--brand-deep)] shadow-sm transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
        onClick={() => handleOpenChange(true)}
        title={label}
        type="button"
      >
        <Share2 aria-hidden="true" size={18} />
      </button>

      <DialogContent className="max-w-[640px] rounded-[28px] bg-[var(--surface)] p-6 sm:p-8">
        <DialogTitle className="pr-10 text-2xl">Поделиться профилем</DialogTitle>
        <DialogDescription className="mt-2">
          Выберите способ отправки ссылки на профиль или скопируйте ее.
        </DialogDescription>

        <div className="mt-7 grid grid-cols-3 gap-4 sm:grid-cols-7">
          {shareTargets.map(({ icon, label: targetLabel, tone, type }) => (
            <button
              className="group flex min-w-0 flex-col items-center gap-3 text-center text-sm font-semibold text-[var(--brand-deep)]"
              key={targetLabel}
              onClick={() => handleShareTarget(type)}
              type="button"
            >
              <span
                className={`grid size-14 place-items-center rounded-full shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-[var(--shadow-card)] ${tone}`}
              >
                <ShareTargetIcon icon={icon} />
              </span>
              <span className="max-w-20 truncate">{targetLabel}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex min-w-0 items-center gap-2 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-muted)] p-2">
          <div className="min-w-0 flex-1 truncate px-3 text-sm font-semibold text-[var(--brand-deep)]">
            {profileUrl}
          </div>
          <button
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[var(--brand-deep)] px-4 py-2 text-sm font-black text-white transition hover:bg-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
            onClick={() => void handleCopyLink()}
            type="button"
          >
            <Copy aria-hidden="true" size={16} />
            Копировать
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShareTargetIcon({ icon }: { icon: ShareTarget["icon"] }) {
  if (icon === "native") {
    return <Smartphone aria-hidden="true" size={24} />;
  }

  if (icon === "telegram") {
    return <Send aria-hidden="true" size={24} />;
  }

  if (icon === "whatsapp") {
    return <MessageCircle aria-hidden="true" size={26} />;
  }

  if (icon === "vk") {
    return <span className="text-lg font-black">VK</span>;
  }

  if (icon === "facebook") {
    return <span className="text-3xl font-black leading-none">f</span>;
  }

  if (icon === "x") {
    return <span className="text-2xl font-black leading-none">X</span>;
  }

  return <Mail aria-hidden="true" size={24} />;
}
