"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageSquareText, RefreshCw, Star } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/src/entities/user";
import { listUserReviews, type UserReview } from "@/src/features/review/api";
import type { ApiPaginationMeta } from "@/src/shared/api";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { Pagination } from "@/src/shared/ui/pagination";
import { Button } from "@/src/shared/ui/shadcn/button";
import { SkeletonPanel } from "@/src/shared/ui/skeleton";

const defaultPaginationMeta: ApiPaginationMeta = {
  currentPage: 1,
  from: null,
  lastPage: 1,
  perPage: 10,
  to: null,
  total: 0,
};

export function ReviewsPage() {
  const user = useUserStore((state) => state.user);
  const [items, setItems] = useState<UserReview[]>([]);
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState(defaultPaginationMeta);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let isMounted = true;

    const loadReviews = async () => {
      try {
        setIsLoading(true);
        const result = await listUserReviews(user.id, {
          page,
          perPage: paginationMeta.perPage,
        });

        if (!isMounted) {
          return;
        }

        setItems(result.items);
        setPaginationMeta(result.meta);
      } catch (error) {
        if (isMounted) {
          toast.error(extractApiError(error, "Не удалось загрузить отзывы."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadReviews();

    return () => {
      isMounted = false;
    };
  }, [page, paginationMeta.perPage, user?.id]);

  const visibleItems = user?.id ? items : [];
  const visibleMeta = user?.id ? paginationMeta : defaultPaginationMeta;
  const visibleLoading = user?.id ? isLoading : false;

  return (
    <div className="grid gap-6">
      <section className="surface-card relative overflow-hidden rounded-[32px] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_24%,transparent),transparent_70%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-deep)]">
            <MessageSquareText size={15} />
            Отзывы
          </div>
          <h1 className="font-heading mt-5 max-w-3xl text-4xl font-black leading-[1.04] text-[var(--brand-deep)] sm:text-5xl">
            Отзывы покупателей по вашим объявлениям.
          </h1>
        </div>
      </section>

      <section className="surface-card rounded-[30px] p-6 sm:p-7">
        {visibleLoading ? (
          <SkeletonPanel className="min-h-60 border border-dashed border-[var(--border-soft)] shadow-none" />
        ) : visibleItems.length === 0 ? (
          <EmptyState
            action={
              <Button asChild>
                <Link href="/account/listings">Открыть объявления</Link>
              </Button>
            }
            description="Отзывы появятся после того, как покупатели оставят их к вашим объявлениям."
            icon={RefreshCw}
            title="Отзывов пока нет"
          />
        ) : (
          <div className="grid gap-4">
            {visibleItems.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        <Pagination
          align="between"
          isLoading={visibleLoading}
          meta={visibleMeta}
          onPageChange={setPage}
          page={page}
          showRange
        />
      </section>
    </div>
  );
}

function ReviewCard({ review }: { review: UserReview }) {
  const reviewerName = [review.reviewer.firstName, review.reviewer.lastName]
    .filter(Boolean)
    .join(" ") || "Пользователь";

  return (
    <article className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-heading text-xl font-black text-[var(--brand-deep)]">
              {reviewerName}
            </h2>
            <RatingBadge rating={review.rating} />
          </div>

          <Link
            className="mt-2 inline-flex max-w-full text-sm font-bold text-[var(--accent)] hover:underline"
            href={`/listings/${review.listing.id}`}
          >
            <span className="truncate">{review.listing.title}</span>
          </Link>
        </div>

        <time className="shrink-0 text-sm font-semibold text-[var(--text-muted)]">
          {formatReviewDate(review.createdAt)}
        </time>
      </div>

      {review.comment ? (
        <p className="mt-4 text-sm leading-6 text-[var(--text)]">
          {review.comment}
        </p>
      ) : null}
    </article>
  );
}

function RatingBadge({ rating }: { rating: number }) {
  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 text-sm font-black text-[var(--brand-deep)]">
      <Star aria-hidden="true" fill="currentColor" size={15} />
      {rating.toFixed(1)}
    </span>
  );
}

function formatReviewDate(value: string | null) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
