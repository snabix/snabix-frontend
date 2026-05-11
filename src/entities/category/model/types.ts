export type CategoryNode = {
  id: number;
  parentId: number | null;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  path: string | null;
  depth: number;
  children: CategoryNode[];
};
