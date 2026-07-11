import Link from "next/link";
import { ArrowLeft, Construction, Star } from "lucide-react";
import { ShareProfileButton } from "@/src/shared/ui/share-profile-button";

type SellerRoutePageProps = {
  params: Promise<{
    seller: string;
  }>;
};

export default async function SellerRoutePage({ params }: SellerRoutePageProps) {
  const { seller } = await params;
  const sellerLabel = decodeURIComponent(seller).replace(/-/g, " ");

  return (
    <main className="mx-auto min-h-[calc(100vh-140px)] w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="surface-card rounded-[34px] p-6 sm:p-8">
        <Link
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text-muted)] transition hover:text-[var(--brand-deep)]"
          href="/"
        >
          <ArrowLeft size={16} />
          Назад к объявлениям
        </Link>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,white)] px-4 py-2 text-sm font-bold text-[var(--accent)]">
              <Star size={16} />
              Профиль продавца
            </p>
            <div className="mt-4 flex items-start gap-3">
              <h1 className="text-3xl font-black tracking-[-0.04em] text-[var(--brand-deep)] sm:text-4xl">
                {sellerLabel}
              </h1>
              <ShareProfileButton
                path={`/sellers/${encodeURIComponent(seller)}`}
                text={`Профиль продавца ${sellerLabel} на Snabix`}
                title={`${sellerLabel} на Snabix`}
              />
            </div>
            <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-[var(--text-muted)]">
              Страница продавца уже зарезервирована в маршрутизации. На следующем этапе сюда можно будет
              вывести профиль, активные объявления, рейтинг и отзывы.
            </p>
          </div>

          <div className="grid w-full max-w-xs gap-3 rounded-[28px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--background)_72%,white)] p-5 text-sm font-medium text-[var(--text-muted)] shadow-[var(--shadow-card)]">
            <div className="inline-flex size-12 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--brand)_14%,white)] text-[var(--brand-deep)]">
              <Construction size={20} />
            </div>
            <p className="text-base font-black text-[var(--brand-deep)]">
              Профиль в разработке
            </p>
            <p>
              Пока здесь только заглушка, но переход из карточки уже работает и URL можно использовать дальше как основной.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
