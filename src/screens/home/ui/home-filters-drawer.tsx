import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/src/shared/ui/shadcn/dialog";
import { PublicListingFilters, type PublicListingFiltersState } from "./public-listing-filters";

type HomeFiltersDrawerProps = {
  filters: PublicListingFiltersState;
  isLoading: boolean;
  isOpen: boolean;
  onChange: (filters: PublicListingFiltersState) => void;
  onClose: () => void;
  onReset: () => void;
  triggerId: string;
};

export function HomeFiltersDrawer({
  filters,
  isLoading,
  isOpen,
  onChange,
  onClose,
  onReset,
  triggerId,
}: HomeFiltersDrawerProps) {
  return (
    <Dialog
      onOpenChange={(nextIsOpen) => {
        if (!nextIsOpen) {
          onClose();
        }
      }}
      open={isOpen}
    >
      <DialogContent
        aria-describedby={undefined}
        className="left-0 top-0 h-full w-full max-w-[390px] translate-x-0 translate-y-0 overflow-hidden rounded-none border-y-0 border-l-0 p-0"
        closeLabel="Закрыть фильтры"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          document.getElementById(triggerId)?.focus();
        }}
      >
        <DialogTitle className="sr-only">Фильтры объявлений</DialogTitle>
        <PublicListingFilters
          filters={filters}
          isLoading={isLoading}
          onChange={onChange}
          onReset={onReset}
        />
      </DialogContent>
    </Dialog>
  );
}
