"use client";

import {
  Copy,
  Mail,
  MessageCircle,
  Send,
  Share2,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/shared/ui/shadcn/dropdown-menu";

type ShareProfileButtonProps = {
  label?: string;
  path: string;
  text?: string;
  title: string;
};

type ShareTarget = {
  icon: LucideIcon;
  label: string;
  type: "email" | "telegram" | "vk" | "whatsapp";
};

const shareTargets: ShareTarget[] = [
  {
    icon: Send,
    label: "Telegram",
    type: "telegram",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    type: "whatsapp",
  },
  {
    icon: MessageCircle,
    label: "VK",
    type: "vk",
  },
  {
    icon: Mail,
    label: "Email",
    type: "email",
  },
];

export function ShareProfileButton({
  label = "Поделиться профилем",
  path,
  text,
  title,
}: ShareProfileButtonProps) {
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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(resolveProfileUrl());
      toast.success("Ссылка на профиль скопирована.");
    } catch {
      toast.error("Не удалось скопировать ссылку.");
    }
  };

  const handleShareTarget = (type: ShareTarget["type"]) => {
    const targetUrl = buildShareTargetUrl(type);

    if (type === "email") {
      window.open(targetUrl, "_self");
      return;
    }

    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={label}
          className="inline-grid size-11 place-items-center rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] text-[var(--brand-deep)] shadow-sm transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
          title={label}
          type="button"
        >
          <Share2 aria-hidden="true" size={18} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 rounded-[24px] border-[var(--border-soft)] p-2 shadow-[var(--shadow-card)]">
        <DropdownMenuItem className="rounded-2xl" onClick={() => void handleNativeShare()}>
          <Smartphone size={17} />
          <span>Поделиться</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {shareTargets.map(({ icon: Icon, label: targetLabel, type }) => (
          <DropdownMenuItem
            className="rounded-2xl"
            key={targetLabel}
            onClick={() => handleShareTarget(type)}
          >
            <Icon size={17} />
            <span>{targetLabel}</span>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="rounded-2xl" onClick={() => void handleCopyLink()}>
          <Copy size={17} />
          <span>Копировать ссылку</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
