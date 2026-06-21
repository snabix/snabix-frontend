import {
  BadgeCheck,
  BookOpen,
  Layers3,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Store,
  type LucideIcon,
} from "lucide-react";
import type { NewsContentBlock, NewsPostDetail, NewsPostItem } from "@/src/entities/news";
import type { BlogContentBlock, BlogPost } from "@/src/screens/blog/model/types";

const fallbackImages = [
  "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&h=700&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&h=700&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&h=700&q=80",
] as const;

const iconsByCategory: Record<string, LucideIcon> = {
  Архитектура: Layers3,
  Безопасность: ShieldCheck,
  Инструкция: BookOpen,
  Новости: Sparkles,
  Обновления: BadgeCheck,
  Продукт: Store,
};

export function newsPostToBlogPost(post: NewsPostItem | NewsPostDetail, index = 0): BlogPost {
  return {
    accent: post.isFeatured ? "dark" : index % 2 === 0 ? "oat" : "light",
    category: post.category,
    contentBlocks: "contentBlocks" in post ? post.contentBlocks.map(newsBlockToBlogBlock) : [],
    date: formatPostDate(post.publishedAt ?? post.createdAt),
    description: post.description,
    eyebrow: post.eyebrow ?? "Snabix journal",
    icon: iconsByCategory[post.category] ?? Newspaper,
    imageUrl: post.imageUrl ?? post.coverMedia?.url ?? fallbackImages[index % fallbackImages.length],
    slug: post.slug,
    thesis: post.thesis ?? post.description,
    title: post.title,
  };
}

function newsBlockToBlogBlock(block: NewsContentBlock): BlogContentBlock {
  if (block.type === "lead" || block.type === "paragraph") {
    return {
      type: block.type,
      text: stringValue(block.text),
    };
  }

  if (block.type === "quote") {
    return {
      type: "quote",
      author: block.author,
      text: stringValue(block.text),
    };
  }

  if (block.type === "split" || block.type === "steps" || block.type === "metrics") {
    return {
      type: block.type,
      items: itemsValue(block.items),
    };
  }

  if (block.type === "image") {
    return {
      type: "image",
      caption: block.caption,
      imageUrl: block.imageUrl ?? block.media?.url,
      media: block.media,
    };
  }

  if (block.type === "gallery" || block.type === "imageGrid") {
    return {
      type: block.type,
      items: imageItemsValue(block.items),
    };
  }

  if (block.type === "table") {
    return {
      type: "table",
      columns: block.columns,
      rows: block.rows,
    };
  }

  return {
    type: "cta",
    buttonLabel: block.buttonLabel,
    href: block.href,
    text: block.text,
    title: block.title,
  };
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function itemsValue(items: NewsContentBlock["items"]): Array<{ label: string; text: string; title: string; value: string }> {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => ({
    label: stringValue(item.label),
    text: stringValue(item.text),
    title: stringValue(item.title),
    value: stringValue(item.value),
  }));
}

function imageItemsValue(items: NewsContentBlock["items"]) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => ({
    caption: stringValue(item.caption),
    imageUrl: stringValue(item.imageUrl),
    media: isMediaValue(item.media) ? item.media : undefined,
    text: stringValue(item.text),
    title: stringValue(item.title),
  }));
}

function isMediaValue(value: unknown): value is { url: string; fileName: string } {
  return typeof value === "object"
    && value !== null
    && "url" in value
    && typeof value.url === "string"
    && "fileName" in value
    && typeof value.fileName === "string";
}

function formatPostDate(value: string | null): string {
  if (value === null) {
    return "Без даты";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
