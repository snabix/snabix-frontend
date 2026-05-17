export type CategoryNode = {
  id: number;
  catalogType: number;
  catalogTypeLabel: string;
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

export type CategoryAttributeDefinition = {
  id: number;
  categoryId: number;
  isInherited: boolean;
  name: string;
  slug: string;
  type: number;
  typeLabel: string;
  unit: string | null;
  description: string | null;
  placeholder: string | null;
  helpText: string | null;
  defaultValue: Record<string, unknown> | string[] | null;
  groupName: string | null;
  options: string[] | null;
  isRequired: boolean;
  isFilterable: boolean;
  showInCard: boolean;
  isActive: boolean;
  appliesToChildren: boolean;
  sortOrder: number;
};
