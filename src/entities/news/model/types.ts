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
  id: string;
  type: "lead" | "paragraph" | "quote" | "split" | "steps" | "metrics" | "image" | "gallery" | "table" | "imageGrid" | "cta";
  typeValue: number;
  typeLabel: string;
  sortOrder: number;
  text?: string;
  author?: string;
  title?: string;
  buttonLabel?: string;
  href?: string;
  imageUrl?: string;
  caption?: string;
  media?: NewsMedia;
  items?: Array<Record<string, unknown>>;
  columns?: string[];
  rows?: Array<Array<string | number | boolean | null>>;
};

export type NewsPostItem = {
  id: string;
  status: number;
  statusLabel: string;
  title: string;
  slug: string;
  category: string;
  eyebrow: string | null;
  description: string;
  thesis: string | null;
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
