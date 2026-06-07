"use client";

import { createPortal } from "react-dom";
import { useSyncExternalStore } from "react";
import { CategoryCatalogBranch } from "@/src/shared/ui/header/CategoryCatalogBranch";
import { CategoryCatalogRoots } from "@/src/shared/ui/header/CategoryCatalogRoots";
import { useCategoryCatalog } from "@/src/shared/ui/header/use-category-catalog";
import { Container } from "@/src/shared/ui/container";

type CategoryCatalogProps = {
  isOpen: boolean;
  onToggle: () => void;
  topOffset: number;
};

export function CategoryCatalog({
  isOpen,
  onToggle,
  topOffset,
}: CategoryCatalogProps) {
  const isMounted = useSyncExternalStore(
    subscribeToMount,
    getClientMountSnapshot,
    getServerMountSnapshot,
  );
  const {
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
  } = useCategoryCatalog({
    isOpen,
    onToggle,
  });

  if (!isOpen) {
    return null;
  }

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-x-0 bottom-0 mt-5 z-30 overflow-hidden bg-[color-mix(in_srgb,var(--background)_96%,transparent)]"
      style={{ top: `${topOffset}px` }}
    >
      <Container className="relative h-full py-3 sm:py-4">
        <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[352px_minmax(0,1fr)] xl:gap-5">
          <CategoryCatalogRoots
            activeRootId={activeRoot ? String(activeRoot.id) : null}
            hasLoadedCategories={hasLoadedCategories}
            onCategorySelect={onToggle}
            onRetry={resetRootError}
            onRootClick={setActiveRootImmediately}
            onRootFocus={setActiveRootImmediately}
            onRootHover={setActiveRootWithIntent}
            roots={roots}
            rootsErrorMessage={rootsErrorMessage}
            rootsStatus={rootsStatus}
          />

          <CategoryCatalogBranch
            activeBranch={activeBranch}
            activeBranchError={activeBranchError}
            activeBranchStatus={activeBranchStatus}
            activeRoot={activeRoot}
            hasLoadedCategories={hasLoadedCategories}
            onCategorySelect={onToggle}
            onRetryBranch={retryActiveBranch}
            onRetryRoots={resetRootError}
            rootsErrorMessage={rootsErrorMessage}
            rootsStatus={rootsStatus}
          />
        </div>
      </Container>
    </div>,
    document.body,
  );
}

function subscribeToMount(): () => void {
  return () => undefined;
}

function getClientMountSnapshot(): boolean {
  return true;
}

function getServerMountSnapshot(): boolean {
  return false;
}
