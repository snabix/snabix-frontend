import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { showCategoryBranchServer } from "@/src/entities/category/api/server-categories";
import { HomePage } from "@/src/screens/home/ui/home-page";
import {
  loadCategoryStorefront,
  loadHomeStorefront,
} from "@/src/screens/listings/server/load-public-storefront";
import { PublicListingsPage } from "@/src/screens/listings/ui/public-listings-page";

type HomeRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: HomeRouteProps): Promise<Metadata> {
  const params = await searchParams;
  const categoryId = parseCategoryId(params.categoryId);

  if (categoryId === undefined) {
    return publicStorefrontMetadata();
  }

  try {
    const category = await showCategoryBranchServer(categoryId);
    const title = `${category.name}: объявления`;
    const description = category.description
      ?? `Актуальные товары и услуги в категории «${category.name}» на SNABIX.`;

    return {
      title,
      description,
      openGraph: {
        title: `${title} | SNABIX`,
        description,
        images: category.icon ? [{ url: category.icon }] : [],
        type: "website",
      },
    };
  } catch {
    return publicStorefrontMetadata();
  }
}

export default async function Page({ searchParams }: HomeRouteProps) {
  const params = await searchParams;
  const categoryId = parseCategoryId(params.categoryId);

  if (categoryId !== undefined) {
    const storefront = await loadCategoryStorefront(categoryId);

    if (storefront.categoryNotFound) {
      notFound();
    }

    return (
      <PublicListingsPage
        initialCategory={storefront.category}
        initialCategoryError={storefront.categoryError}
        initialCategoryId={categoryId}
        initialListings={storefront.listings}
        key={categoryId}
      />
    );
  }

  const storefront = await loadHomeStorefront();

  return (
    <HomePage
      initialCategories={storefront.categories}
      initialCategoriesError={storefront.categoriesError}
      initialListings={storefront.listings}
      key="all"
    />
  );
}

function parseCategoryId(value: string | string[] | undefined): string | undefined {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (!rawValue) {
    return undefined;
  }

  return rawValue.trim() !== "" ? rawValue : undefined;
}

function publicStorefrontMetadata(): Metadata {
  const title = "Объявления, товары и услуги";
  const description = "Публичная витрина актуальных предложений SNABIX.";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | SNABIX`,
      description,
      type: "website",
    },
  };
}
