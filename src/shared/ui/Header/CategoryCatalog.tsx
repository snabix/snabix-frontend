import { createPortal } from "react-dom";
import { CategoryCatalogBranch } from "@/src/shared/ui/Header/CategoryCatalogBranch";
import { CategoryCatalogRoots } from "@/src/shared/ui/Header/CategoryCatalogRoots";
import { useCategoryCatalog } from "@/src/shared/ui/Header/use-category-catalog";

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

  const portalRoot = typeof document === "undefined" ? null : document.body;

  if (portalRoot === null) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-x-0 bottom-0 mt-5 z-30 overflow-hidden bg-[color-mix(in_srgb,var(--background)_96%,transparent)]"
      style={{ top: `${topOffset}px` }}
    >
      <div className="relative h-full px-3 py-3 sm:px-4 sm:py-4">
        <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[352px_minmax(0,1fr)] xl:gap-5">
          <CategoryCatalogRoots
            activeRootId={activeRoot?.id ?? null}
            hasLoadedCategories={hasLoadedCategories}
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
            onRetryBranch={retryActiveBranch}
            onRetryRoots={resetRootError}
            rootsErrorMessage={rootsErrorMessage}
            rootsStatus={rootsStatus}
          />
        </div>
      </div>
    </div>,
    portalRoot,
  );
}
