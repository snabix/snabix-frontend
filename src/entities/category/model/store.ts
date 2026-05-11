import { create } from "zustand";
import { listRootCategories, showCategoryBranch } from "@/src/entities/category/api/list-categories";
import type { CategoryNode } from "@/src/entities/category/model/types";
import { extractApiError } from "@/src/shared/lib/extract-api-error";

type CategoryStatus = "idle" | "loading" | "success" | "error";

type CategoryStore = {
  roots: CategoryNode[];
  rootsStatus: CategoryStatus;
  rootsErrorMessage: string | null;
  branches: Record<number, CategoryNode>;
  branchStatuses: Record<number, CategoryStatus>;
  branchErrorMessages: Record<number, string | null>;
  loadRoots: () => Promise<void>;
  loadBranch: (categoryId: number) => Promise<void>;
  resetRootError: () => void;
  resetBranchError: (categoryId: number) => void;
};

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  roots: [],
  rootsStatus: "idle",
  rootsErrorMessage: null,
  branches: {},
  branchStatuses: {},
  branchErrorMessages: {},
  loadRoots: async () => {
    const { roots, rootsStatus } = get();

    if (roots.length > 0 || rootsStatus === "loading") {
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
  loadBranch: async (categoryId: number) => {
    const { branches, branchStatuses } = get();

    if (branches[categoryId] || branchStatuses[categoryId] === "loading") {
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
}));
