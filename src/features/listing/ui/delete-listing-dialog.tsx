import { AlertTriangle, LoaderCircle, Trash2 } from "lucide-react";
import { Button } from "@/src/shared/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/shadcn/dialog";

type DeleteListingDialogProps = {
  isDeleting: boolean;
  isOpen: boolean;
  listingTitle?: string | null;
  onConfirm: () => void;
  onOpenChange: (isOpen: boolean) => void;
};

export function DeleteListingDialog({
  isDeleting,
  isOpen,
  listingTitle,
  onConfirm,
  onOpenChange,
}: DeleteListingDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <div className="grid size-12 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--danger)_12%,var(--surface))] text-[var(--danger)]">
            <AlertTriangle aria-hidden="true" size={22} />
          </div>

          <DialogTitle className="mt-4">
            Удалить объявление?
          </DialogTitle>

          <DialogDescription className="mt-2">
            {listingTitle ? (
              <>
                Объявление <span className="font-semibold text-[var(--brand-deep)]">&quot;{listingTitle}&quot;</span> будет удалено
                без возможности восстановления.
              </>
            ) : (
              "Объявление будет удалено без возможности восстановления."
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6">
          <Button
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
            type="button"
            variant="outline"
          >
            Отменить
          </Button>

          <Button
            disabled={isDeleting}
            onClick={onConfirm}
            type="button"
            variant="destructive"
          >
            {isDeleting ? (
              <>
                <LoaderCircle aria-hidden="true" className="animate-spin" size={17} />
                Удаляем...
              </>
            ) : (
              <>
                <Trash2 aria-hidden="true" size={17} />
                Удалить
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
