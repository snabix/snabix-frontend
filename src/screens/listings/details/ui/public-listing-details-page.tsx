import Link from "next/link";
import { ArrowLeft, ChevronRight, MapPin, SearchX } from "lucide-react";
import { ListingMediaGallery, type PublicListingItem } from "@/src/entities/listing";
import { Container } from "@/src/shared/ui/container";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { Button } from "@/src/shared/ui/shadcn/button";

type PublicListingDetailsPageProps = {
  listing: PublicListingItem;
};

export function PublicListingDetailsPage({
  listing,
}: PublicListingDetailsPageProps) {
  const categoryPath = buildCategoryBreadcrumbs(listing);
  const publishedAt = formatListingDate(listing.publishedAt);

  return (
    <main className="py-8">
      <Container>
        <article className="grid gap-6">
          <section className="surface-card overflow-hidden rounded-[32px] p-6 sm:p-8">
            <Button asChild variant="ghost">
              <Link href="/">
                <ArrowLeft size={17} />
                К объявлениям
              </Link>
            </Button>

        <nav aria-label="Категория объявления" className="mt-6 flex flex-wrap items-center gap-2 text-sm font-black text-[var(--text-muted)]">
          <Link className="transition-colors hover:text-[var(--brand-deep)]" href="/">
            Объявления
          </Link>
          {categoryPath.map((category) => (
            <span className="inline-flex items-center gap-2" key={category.id}>
              <ChevronRight size={15} />
              <Link
                className="transition-colors hover:text-[var(--brand-deep)]"
                href={`/?categoryId=${encodeURIComponent(String(category.id))}`}
              >
                {category.name}
              </Link>
            </span>
          ))}
        </nav>

        <div className="mt-6">
          <h1 className="font-heading max-w-5xl text-4xl font-black leading-tight text-[var(--brand-deep)] sm:text-5xl">
            {listing.title}
          </h1>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_380px]">
          <ListingMediaGallery
            imageUrl={listing.imageUrl}
            imageUrls={listing.imageUrls}
            mode="details"
            title={listing.title}
          />

          <aside className="rounded-[30px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] p-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--brand-deep)]">
                {listing.statusLabel}
              </span>
              <span className="rounded-full border border-[var(--border-soft)] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--text-muted)]">
                {listing.typeLabel}
              </span>
            </div>

            <dl className="mt-6 grid gap-3 text-sm">
              <Detail label="Цена" value={listing.price === null ? "Цена не указана" : `${new Intl.NumberFormat("ru-RU").format(listing.price)} ${listing.currency ?? "RUB"}`} />
              <Detail label="Тип объявления" value={listing.typeLabel} />
              <Detail label="Состояние" value={listing.conditionLabel} />
              <Detail label="Публикация" value={publishedAt} />
            </dl>

            {listing.category ? (
              <div className="mt-5 inline-flex items-start gap-2 rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-sm font-semibold text-[var(--brand-deep)]">
                <MapPin className="mt-0.5 shrink-0" size={17} />
                {listing.category.name}
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="surface-card rounded-[30px] p-6 sm:p-7">
          <h2 className="font-heading text-2xl font-black text-[var(--brand-deep)]">Описание</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--text-muted)]">
            {listing.description}
          </p>
        </div>

        <aside className="surface-card rounded-[30px] p-6 sm:p-7">
          <h2 className="font-heading text-2xl font-black text-[var(--brand-deep)]">Детали</h2>
          <dl className="mt-5 grid gap-3">
            <Detail label="Категория" value={categoryPath.map((category) => category.name).join(" / ") || "—"} />
            <Detail label="Состояние" value={listing.conditionLabel} />
            <Detail label="Торг" value={listing.isNegotiable ? "Разрешен" : "Не указан"} />
            <Detail label="Просмотры" value={String(listing.viewsCount)} />
          </dl>
        </aside>
      </section>

          {listing.attributeValues.length > 0 ? (
            <section className="surface-card rounded-[30px] p-6 sm:p-7">
              <h2 className="font-heading text-2xl font-black text-[var(--brand-deep)]">Характеристики</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {listing.attributeValues.map((attribute) => (
                  <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-4" key={attribute.attributeDefinitionId}>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      {attribute.name ?? "Параметр"}
                    </p>
                    <p className="mt-2 font-black text-[var(--brand-deep)]">
                      {attribute.displayValue ?? "—"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </Container>
    </main>
  );
}

export function PublicListingUnavailablePage() {
  return (
    <Container className="py-8">
      <EmptyState
        description="Не удалось получить объявление с сервера. Попробуйте обновить страницу чуть позже."
        icon={SearchX}
        title="Объявление временно недоступно"
      />
    </Container>
  );
}

type CategoryBreadcrumb = {
  id: string | number;
  name: string;
  slug: string;
};

function buildCategoryBreadcrumbs(listing: PublicListingItem): CategoryBreadcrumb[] {
  if (listing.category === null) {
    return [];
  }

  if (listing.category.breadcrumbs !== undefined && listing.category.breadcrumbs.length > 0) {
    return listing.category.breadcrumbs;
  }

  const names = [listing.category.fullName ?? listing.category.name]
    .flatMap((value) => value.split(/[/>]/))
    .map((segment) => segment.trim())
    .filter(Boolean);

  return names.map((name, index) => ({
    id: index === names.length - 1 ? listing.category?.id ?? name : name,
    name,
    slug: name,
  }));
}

function formatListingDate(value: string | null): string {
  if (value === null) {
    return "Не указано";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Не указано";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3">
      <dt className="text-xs font-black uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</dt>
      <dd className="mt-2 text-sm font-black text-[var(--brand-deep)]">{value}</dd>
    </div>
  );
}
