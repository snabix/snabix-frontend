import { useEffect, useRef, useState } from "react";
import { useCategoryStore } from "@/src/entities/category";

type UseCategoryCatalogOptions = {
  isOpen: boolean;
  onToggle: () => void;
};

export function useCategoryCatalog({
  isOpen,
  onToggle,
}: UseCategoryCatalogOptions) {
  const rootHoverTimeoutRef = useRef<number | null>(null);
  const [activeRootId, setActiveRootId] = useState<number | null>(null);
  const roots               = useCategoryStore((state) => state.roots);
  const rootsStatus         = useCategoryStore((state) => state.rootsStatus);
  const rootsErrorMessage   = useCategoryStore((state) => state.rootsErrorMessage);
  const branches            = useCategoryStore((state) => state.branches);
  const branchStatuses      = useCategoryStore((state) => state.branchStatuses);
  const branchErrorMessages = useCategoryStore((state) => state.branchErrorMessages);
  const loadRoots           = useCategoryStore((state) => state.loadRoots);
  const loadBranch          = useCategoryStore((state) => state.loadBranch);
  const resetRootError      = useCategoryStore((state) => state.resetRootError);
  const resetBranchError    = useCategoryStore((state) => state.resetBranchError);
  const resolvedRootId      = activeRootId ?? roots[0]?.id ?? null;

  useEffect(() => {
    if (!isOpen) {
      if (rootHoverTimeoutRef.current !== null) {
        window.clearTimeout(rootHoverTimeoutRef.current);
        rootHoverTimeoutRef.current = null;
      }

      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    void loadRoots();
  }, [isOpen, loadRoots]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onToggle]);

  useEffect(() => {
    if (!isOpen || resolvedRootId === null) {
      return;
    }

    void loadBranch(resolvedRootId);
  }, [isOpen, loadBranch, resolvedRootId]);

  const activeRoot = roots.find((item) => item.id === resolvedRootId) ?? roots[0] ?? null;
  const activeBranch = resolvedRootId !== null ? branches[resolvedRootId] ?? null : null;
  const activeBranchStatus = resolvedRootId !== null ? branchStatuses[resolvedRootId] ?? "idle" : "idle";
  const activeBranchError = resolvedRootId !== null ? branchErrorMessages[resolvedRootId] ?? null : null;
  const hasLoadedCategories = roots.length > 0;

  const setActiveRootWithIntent = (categoryId: number) => {
    if (rootHoverTimeoutRef.current !== null) {
      window.clearTimeout(rootHoverTimeoutRef.current);
    }

    rootHoverTimeoutRef.current = window.setTimeout(() => {
      setActiveRootId(categoryId);
      rootHoverTimeoutRef.current = null;
    }, 120);
  };

  const setActiveRootImmediately = (categoryId: number) => {
    if (rootHoverTimeoutRef.current !== null) {
      window.clearTimeout(rootHoverTimeoutRef.current);
      rootHoverTimeoutRef.current = null;
    }

    setActiveRootId(categoryId);
  };

  const retryActiveBranch = () => {
    if (resolvedRootId === null) {
      return;
    }

    resetBranchError(resolvedRootId);
  };

  return {
    activeBranch,
    activeBranchError,
    activeBranchStatus,
    activeRoot,
    hasLoadedCategories,
    resetRootError,
    retryActiveBranch,
    roots,
    rootsErrorMessage,
    rootsStatus,
    setActiveRootImmediately,
    setActiveRootWithIntent,
  };
}
