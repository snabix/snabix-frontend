import { create } from "zustand";
import { listRootCategories, showCategoryBranch } from "@/src/entities/category/api/list-categories";
import type { CategoryNode } from "@/src/entities/category/model/types";
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
  loadRoots: (options?: LoadCategoryOptions) => Promise<void>;
  loadBranch: (categoryId: number, options?: LoadCategoryOptions) => Promise<void>;
  resetRootError: () => void;
  resetBranchError: (categoryId: number) => void;
  invalidateRoots: () => void;
  invalidateBranch: (categoryId: number) => void;
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
}));
