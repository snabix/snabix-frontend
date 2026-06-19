import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/src/shared/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/shadcn/dialog";

export function SettingsSection({
  children,
  description,
  icon: Icon,
  title,
}: {
  children: ReactNode;
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <section className="surface-card rounded-[30px] p-6 sm:p-7">
      <div className="mb-5 flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <Icon aria-hidden="true" size={20} />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-black text-[var(--brand-deep)]">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-[var(--danger)]">{message}</p>;
}

export function ConfirmActionDialog({
  actionLabel,
  description,
  isOpen,
  onConfirmAction,
  onOpenChangeAction,
  title,
}: {
  actionLabel: string;
  description: string;
  isOpen: boolean;
  onConfirmAction: () => void;
  onOpenChangeAction: (isOpen: boolean) => void;
  title: string;
}) {
  return (
    <Dialog onOpenChange={onOpenChangeAction} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={() => onOpenChangeAction(false)} type="button" variant="outline">
            Отменить
          </Button>
          <Button onClick={onConfirmAction} type="button" variant="destructive">
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
