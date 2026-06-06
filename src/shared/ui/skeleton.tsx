import { cn } from "@/src/shared/lib/utils";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-2xl bg-[color-mix(in_srgb,var(--foreground)_10%,transparent)]",
        className,
      )}
    />
  );
}

export function SkeletonPanel({ className }: SkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Данные загружаются"
      className={cn(
        "surface-card grid gap-4 rounded-[30px] p-6 sm:p-7",
        className,
      )}
      role="status"
    >
      <Skeleton className="h-8 w-2/5" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
      <div className="mt-2 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </div>
      <span className="sr-only">Данные загружаются</span>
    </div>
  );
}
