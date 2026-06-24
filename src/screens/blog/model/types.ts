import type { LucideIcon } from "lucide-react";

export type BlogContentBlock =
  | {
      type: "lead";
      text: string;
    }
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "quote";
      author?: string;
      text: string;
    }
  | {
      type: "split";
      items: Array<{
        title: string;
        text: string;
      }>;
    }
  | {
      type: "steps";
      items: Array<{
        title: string;
        text: string;
      }>;
    }
  | {
      type: "metrics";
      items: Array<{
        label: string;
        value: string;
      }>;
    }
  | {
      type: "image";
      imageUrl?: string;
      caption?: string;
      media?: {
        url: string;
        fileName: string;
      };
    }
  | {
      type: "gallery";
      items?: Array<{
        caption?: string;
        imageUrl?: string;
        media?: {
          url: string;
          fileName: string;
        };
      }>;
    }
  | {
      type: "table";
      columns?: string[];
      rows?: Array<Array<string | number | boolean | null>>;
    }
  | {
      type: "imageGrid";
      items?: Array<{
        title?: string;
        text?: string;
        caption?: string;
        imageUrl?: string;
        media?: {
          url: string;
          fileName: string;
        };
      }>;
    }
  | {
      type: "cta";
      title?: string;
      text?: string;
      buttonLabel?: string;
      href?: string;
    };

export type BlogPost = {
  accent: "dark" | "light" | "oat" | "indigo";
  category: string;
  contentBlocks: BlogContentBlock[];
  date: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  imageUrl: string;
  readingTime?: string | null;
  slug: string;
  thesis: string;
  title: string;
};
