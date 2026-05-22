import { create } from "zustand";
import {
  getCategoryAttributes,
  listRootCategories,
  showCategoryBranch,
} from "@/src/entities/category/api/list-categories";
import type {
  CategoryAttributeDefinition,
  CategoryNode,
} from "@/src/entities/category/model/types";
import { extractApiError } from "@/src/shared/lib/extract-api-error";

type CategoryStatus = "idle" | "loading" | "success" | "error";
type LoadCategoryOptions = {
  force?: boolean;
};

const CATEGORY_CACHE_TTL_MS = 5 * 60 * 1000;

function hasFreshTimestamp(timestamp: number | null | undefined): boolean {
  if (typeof timestamp !== "number") {
    return false;
  }

  return Date.now() - timestamp < CATEGORY_CACHE_TTL_MS;
}

type CategoryStore = {
  roots: CategoryNode[];
  rootsStatus: CategoryStatus;
  rootsErrorMessage: string | null;
  rootsFetchedAt: number | null;
  branches: Record<number, CategoryNode>;
  branchStatuses: Record<number, CategoryStatus>;
  branchErrorMessages: Record<number, string | null>;
  branchesFetchedAt: Record<number, number | null>;
  categoryAttributes: Record<number, CategoryAttributeDefinition[]>;
  categoryAttributeStatuses: Record<number, CategoryStatus>;
  categoryAttributeErrorMessages: Record<number, string | null>;
  categoryAttributesFetchedAt: Record<number, number | null>;
  loadRoots: (options?: LoadCategoryOptions) => Promise<void>;
  loadBranch: (categoryId: number, options?: LoadCategoryOptions) => Promise<void>;
  loadCategoryAttributes: (categoryId: number, options?: LoadCategoryOptions) => Promise<void>;
  resetRootError: () => void;
  resetBranchError: (categoryId: number) => void;
  resetCategoryAttributesError: (categoryId: number) => void;
  invalidateRoots: () => void;
  invalidateBranch: (categoryId: number) => void;
  invalidateCategoryAttributes: (categoryId: number) => void;
};

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  roots: [],
  rootsStatus: "idle",
  rootsErrorMessage: null,
  rootsFetchedAt: null,
  branches: {},
  branchStatuses: {},
  branchErrorMessages: {},
  branchesFetchedAt: {},
  categoryAttributes: {},
  categoryAttributeStatuses: {},
  categoryAttributeErrorMessages: {},
  categoryAttributesFetchedAt: {},
  loadRoots: async (options) => {
    const { roots, rootsFetchedAt, rootsStatus } = get();
    const forceReload = options?.force === true;
    const hasFreshRoots = roots.length > 0 && hasFreshTimestamp(rootsFetchedAt);

    if ((!forceReload && hasFreshRoots) || rootsStatus === "loading") {
      return;
    }

    set({
      rootsStatus: "loading",
      rootsErrorMessage: null,
    });

    try {
      const items = await listRootCategories();

      set({
        roots: items,
        rootsFetchedAt: Date.now(),
        rootsStatus: "success",
        rootsErrorMessage: null,
      });
    } catch (error) {
      set({
        rootsStatus: "error",
        rootsErrorMessage: extractApiError(
          error,
          "Не удалось загрузить каталог категорий.",
        ),
      });
    }
  },
  loadBranch: async (categoryId: number, options) => {
    const { branches, branchesFetchedAt, branchStatuses } = get();
    const forceReload = options?.force === true;
    const hasFreshBranch = Boolean(branches[categoryId]) && hasFreshTimestamp(branchesFetchedAt[categoryId]);

    if ((!forceReload && hasFreshBranch) || branchStatuses[categoryId] === "loading") {
      return;
    }

    set((state) => ({
      branchStatuses: {
        ...state.branchStatuses,
        [categoryId]: "loading",
      },
      branchErrorMessages: {
        ...state.branchErrorMessages,
        [categoryId]: null,
      },
    }));

    try {
      const branch = await showCategoryBranch(categoryId);

      set((state) => ({
        branches: {
          ...state.branches,
          [categoryId]: branch,
        },
        branchesFetchedAt: {
          ...state.branchesFetchedAt,
          [categoryId]: Date.now(),
        },
        branchStatuses: {
          ...state.branchStatuses,
          [categoryId]: "success",
        },
        branchErrorMessages: {
          ...state.branchErrorMessages,
          [categoryId]: null,
        },
      }));
    } catch (error) {
      set((state) => ({
        branchStatuses: {
          ...state.branchStatuses,
          [categoryId]: "error",
        },
        branchErrorMessages: {
          ...state.branchErrorMessages,
          [categoryId]: extractApiError(
            error,
            "Не удалось загрузить раздел каталога.",
          ),
        },
      }));
    }
  },
  loadCategoryAttributes: async (categoryId: number, options) => {
    const {
      categoryAttributes,
      categoryAttributesFetchedAt,
      categoryAttributeStatuses,
    } = get();
    const forceReload = options?.force === true;
    const hasFreshAttributes = Boolean(categoryAttributes[categoryId])
      && hasFreshTimestamp(categoryAttributesFetchedAt[categoryId]);

    if ((!forceReload && hasFreshAttributes) || categoryAttributeStatuses[categoryId] === "loading") {
      return;
    }

    set((state) => ({
      categoryAttributeStatuses: {
        ...state.categoryAttributeStatuses,
        [categoryId]: "loading",
      },
      categoryAttributeErrorMessages: {
        ...state.categoryAttributeErrorMessages,
        [categoryId]: null,
      },
    }));

    try {
      const attributes = await getCategoryAttributes(categoryId);

      set((state) => ({
        categoryAttributes: {
          ...state.categoryAttributes,
          [categoryId]: attributes,
        },
        categoryAttributesFetchedAt: {
          ...state.categoryAttributesFetchedAt,
          [categoryId]: Date.now(),
        },
        categoryAttributeStatuses: {
          ...state.categoryAttributeStatuses,
          [categoryId]: "success",
        },
        categoryAttributeErrorMessages: {
          ...state.categoryAttributeErrorMessages,
          [categoryId]: null,
        },
      }));
    } catch (error) {
      set((state) => ({
        categoryAttributeStatuses: {
          ...state.categoryAttributeStatuses,
          [categoryId]: "error",
        },
        categoryAttributeErrorMessages: {
          ...state.categoryAttributeErrorMessages,
          [categoryId]: extractApiError(
            error,
            "Не удалось загрузить характеристики категории.",
          ),
        },
      }));
    }
  },
  resetRootError: () => set({ rootsStatus: "idle", rootsErrorMessage: null }),
  resetBranchError: (categoryId: number) =>
    set((state) => ({
      branchStatuses: {
        ...state.branchStatuses,
        [categoryId]: "idle",
      },
      branchErrorMessages: {
        ...state.branchErrorMessages,
        [categoryId]: null,
      },
    })),
  resetCategoryAttributesError: (categoryId: number) =>
    set((state) => ({
      categoryAttributeStatuses: {
        ...state.categoryAttributeStatuses,
        [categoryId]: "idle",
      },
      categoryAttributeErrorMessages: {
        ...state.categoryAttributeErrorMessages,
        [categoryId]: null,
      },
    })),
  invalidateRoots: () =>
    set({
      rootsFetchedAt: null,
      rootsStatus: "idle",
    }),
  invalidateBranch: (categoryId: number) =>
    set((state) => ({
      branchesFetchedAt: {
        ...state.branchesFetchedAt,
        [categoryId]: null,
      },
      branchStatuses: {
        ...state.branchStatuses,
        [categoryId]: "idle",
      },
    })),
  invalidateCategoryAttributes: (categoryId: number) =>
    set((state) => ({
      categoryAttributesFetchedAt: {
        ...state.categoryAttributesFetchedAt,
        [categoryId]: null,
      },
      categoryAttributeStatuses: {
        ...state.categoryAttributeStatuses,
        [categoryId]: "idle",
      },
    })),
}));
