export type NewsMedia = {
  id: number;
  url: string;
  fileName: string;
  mimeType: string | null;
};

export type NewsAuthor = {
  id: number;
  name: string;
  email: string;
};

export type NewsContentBlock = {
  typeLabel: string;
  sortOrder: number;
  id: string;
} & (
  | {
      type: "lead" | "paragraph";
      text: string;
    }
  | {
      type: "quote";
      author?: string;
      text: string;
    }
  | {
      type: "split" | "steps";
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
      caption?: string;
      imageUrl?: string;
      media?: NewsMedia;
    }
  | {
      type: "gallery";
      items: Array<{
        caption?: string;
        imageUrl?: string;
        media?: NewsMedia;
      }>;
    }
  | {
      type: "table";
      columns: string[];
      rows: Array<Array<string | number | boolean | null>>;
    }
  | {
      type: "imageGrid";
      items: Array<{
        title?: string;
        text?: string;
        caption?: string;
        imageUrl?: string;
        media?: NewsMedia;
      }>;
    }
  | {
      type: "cta";
      buttonLabel?: string;
      href?: string;
      text?: string;
      title?: string;
    }
);

export type NewsPostItem = {
  id: string;
  publicationStatus: "draft" | "published" | "archived";
  publicationStatusLabel: string;
  title: string;
  slug: string;
  category: string;
  eyebrow: string | null;
  description: string;
  thesis: string | null;
  readingTime: string | null;
  isFeatured: boolean;
  viewsCount: number;
  imageUrl?: string | null;
  coverMedia: NewsMedia | null;
  author: NewsAuthor | null;
  publishedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type NewsPostDetail = NewsPostItem & {
  contentBlocks: NewsContentBlock[];
};
