import Link from "next/link";
import {
  Archive,
  ChevronRight,
  Menu,
  Pencil,
  Trash2,
} from "lucide-react";
import { LISTING_STATUS_ARCHIVED, type ListingItem } from "@/src/entities/listing";
import {
  buildListingOwnerActionsPolicy,
} from "@/src/features/listing/model/listing-owner-actions-policy";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/shared/ui/shadcn/dropdown-menu";

type ListingManagementMenuProps = {
  editHref: string;
  isArchiving?: boolean;
  isDeleting?: boolean;
  isSubmittingForReview?: boolean;
  listing: Pick<ListingItem, "status">;
  onArchive: () => void;
  onDelete: () => void;
  onSubmitForReview: () => void;
};

export function ListingManagementMenu({
  editHref,
  isArchiving = false,
  isDeleting = false,
  isSubmittingForReview = false,
  listing,
  onArchive,
  onDelete,
  onSubmitForReview,
}: ListingManagementMenuProps) {
  const policy = buildListingOwnerActionsPolicy({
    isArchiving,
    isDeleting,
    isSubmittingForReview,
    listing,
  });
  const isArchived = listing.status === LISTING_STATUS_ARCHIVED;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Открыть меню действий объявления"
          className="grid size-12 place-items-center rounded-2xl border border-[color-mix(in_srgb,var(--accent)_34%,var(--border-soft))] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] text-[var(--brand-deep)] shadow-[var(--shadow-card)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          type="button"
        >
          <Menu size={21} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-64 rounded-[24px] border-[var(--border-soft)] p-2 shadow-[var(--shadow-card)]">
        {policy.edit.isVisible ? (
          <DropdownMenuItem asChild className="rounded-2xl" disabled={policy.edit.isDisabled}>
            <Link className="flex items-center gap-3" href={editHref}>
              <Pencil size={17} />
              <span>Редактировать</span>
            </Link>
          </DropdownMenuItem>
        ) : null}

        {policy.archive.isVisible ? (
          <DropdownMenuItem
            className="rounded-2xl"
            disabled={policy.archive.isDisabled}
            onClick={onArchive}
          >
            <Archive size={17} />
            <span>{isArchived ? "Уже в архиве" : (isArchiving ? "Архивируем..." : "Архивировать")}</span>
          </DropdownMenuItem>
        ) : null}

        {policy.submitForReview.isVisible ? (
          <DropdownMenuItem
            className="rounded-2xl"
            disabled={policy.submitForReview.isDisabled}
            onClick={onSubmitForReview}
          >
            <ChevronRight size={17} />
            <span>{isSubmittingForReview ? "Отправляем..." : "Отправить на проверку"}</span>
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuSeparator />

        {policy.delete.isVisible ? (
          <DropdownMenuItem
            className="rounded-2xl text-[var(--danger)] focus:text-[var(--danger)]"
            disabled={policy.delete.isDisabled}
            onClick={onDelete}
          >
            <Trash2 size={17} />
            <span>Удалить объявление</span>
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
