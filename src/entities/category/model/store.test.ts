import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  CategoryAttributeDefinition,
  CategoryNode,
} from "@/src/entities/category/model/types";
import { useCategoryStore } from "@/src/entities/category/model/store";

const {
  getCategoryAttributesMock,
  listRootCategoriesMock,
  showCategoryBranchMock,
} = vi.hoisted(() => ({
  getCategoryAttributesMock: vi.fn<(categoryId: number) => Promise<CategoryAttributeDefinition[]>>(),
  listRootCategoriesMock: vi.fn<() => Promise<CategoryNode[]>>(),
  showCategoryBranchMock: vi.fn<(categoryId: number) => Promise<CategoryNode>>(),
}));

vi.mock("@/src/entities/category/api/list-categories", () => ({
  getCategoryAttributes: getCategoryAttributesMock,
  listRootCategories: listRootCategoriesMock,
  showCategoryBranch: showCategoryBranchMock,
}));

const rootCategory: CategoryNode = {
  id: 1,
  catalogType: 1,
  catalogTypeLabel: "Товары",
  parentId: null,
  name: "Электроника",
  slug: "electronics",
  description: null,
  sortOrder: 100,
  isActive: true,
  path: "electronics",
  depth: 0,
  children: [],
};

const branchCategory: CategoryNode = {
  ...rootCategory,
  children: [
    {
      id: 2,
      catalogType: 1,
      catalogTypeLabel: "Товары",
      parentId: 1,
      name: "Смартфоны",
      slug: "smartphones",
      description: null,
      sortOrder: 110,
      isActive: true,
      path: "electronics/smartphones",
      depth: 1,
      children: [],
    },
  ],
};

const categoryAttributes: CategoryAttributeDefinition[] = [
  {
    id: 10,
    appliesToChildren: true,
    categoryId: 2,
    defaultValue: null,
    description: null,
    groupName: "Основные",
    helpText: "Укажите бренд устройства.",
    isActive: true,
    isFilterable: true,
    isInherited: false,
    isRequired: true,
    name: "Бренд",
    options: ["Apple", "Samsung"],
    placeholder: "Выберите бренд",
    showInCard: true,
    slug: "brand",
    sortOrder: 10,
    type: 4,
    typeLabel: "Выбор",
    unit: null,
  },
];

describe("useCategoryStore", () => {
  beforeEach(() => {
    getCategoryAttributesMock.mockReset();
    listRootCategoriesMock.mockReset();
    showCategoryBranchMock.mockReset();
    useCategoryStore.setState(useCategoryStore.getInitialState(), true);
  });

  it("loads roots once and reuses fresh cache", async () => {
    listRootCategoriesMock.mockResolvedValue([rootCategory]);

    await useCategoryStore.getState().loadRoots();
    await useCategoryStore.getState().loadRoots();

    expect(listRootCategoriesMock).toHaveBeenCalledTimes(1);
    expect(useCategoryStore.getState().roots).toEqual([rootCategory]);
    expect(useCategoryStore.getState().rootsStatus).toBe("success");
  });

  it("reloads roots when force flag is passed", async () => {
    listRootCategoriesMock.mockResolvedValue([rootCategory]);

    await useCategoryStore.getState().loadRoots();
    await useCategoryStore.getState().loadRoots({ force: true });

    expect(listRootCategoriesMock).toHaveBeenCalledTimes(2);
  });

  it("loads a branch once and keeps it in cache", async () => {
    showCategoryBranchMock.mockResolvedValue(branchCategory);

    await useCategoryStore.getState().loadBranch(1);
    await useCategoryStore.getState().loadBranch(1);

    expect(showCategoryBranchMock).toHaveBeenCalledTimes(1);
    expect(useCategoryStore.getState().branches[1]).toEqual(branchCategory);
    expect(useCategoryStore.getState().branchStatuses[1]).toBe("success");
  });

  it("invalidates branch cache for explicit refresh", async () => {
    showCategoryBranchMock.mockResolvedValue(branchCategory);

    await useCategoryStore.getState().loadBranch(1);
    useCategoryStore.getState().invalidateBranch(1);
    await useCategoryStore.getState().loadBranch(1);

    expect(showCategoryBranchMock).toHaveBeenCalledTimes(2);
  });

  it("loads category attributes once and reuses fresh cache", async () => {
    getCategoryAttributesMock.mockResolvedValue(categoryAttributes);

    await useCategoryStore.getState().loadCategoryAttributes(2);
    await useCategoryStore.getState().loadCategoryAttributes(2);

    expect(getCategoryAttributesMock).toHaveBeenCalledTimes(1);
    expect(useCategoryStore.getState().categoryAttributes[2]).toEqual(categoryAttributes);
    expect(useCategoryStore.getState().categoryAttributeStatuses[2]).toBe("success");
  });

  it("invalidates category attributes cache for explicit refresh", async () => {
    getCategoryAttributesMock.mockResolvedValue(categoryAttributes);

    await useCategoryStore.getState().loadCategoryAttributes(2);
    useCategoryStore.getState().invalidateCategoryAttributes(2);
    await useCategoryStore.getState().loadCategoryAttributes(2);

    expect(getCategoryAttributesMock).toHaveBeenCalledTimes(2);
  });
});
