export type CategoryNode = {
  id: string | number;
  catalogKind: "product" | "service";
  catalogKindLabel: string;
  parentId: string | number | null;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  path: string | null;
  depth: number;
  children: CategoryNode[];
};

export type CategoryAttributeDefinition = {
  id: number;
  categoryId: string | number;
  isInherited: boolean;
  name: string;
  slug: string;
  valueType: "text" | "number" | "boolean" | "select" | "multiSelect" | "date";
  valueTypeLabel: string;
  unit: string | null;
  description: string | null;
  placeholder: string | null;
  helpText: string | null;
  defaultValue: Record<string, unknown> | string[] | null;
  dependencyRules: CategoryAttributeDependencyRule[] | null;
  groupName: string | null;
  options: string[] | null;
  isRequired: boolean;
  isFilterable: boolean;
  showInCard: boolean;
  schemaVersion?: number;
  isActive: boolean;
  appliesToChildren: boolean;
  sortOrder: number;
};

export type CategoryAttributeDependencyRule = {
  attributeDefinitionId?: number;
  attributeSlug?: string;
  operator: "equals" | "not_equals" | "in" | "not_in" | "filled" | "empty";
  value?: unknown;
};
