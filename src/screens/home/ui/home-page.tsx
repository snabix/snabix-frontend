import type { CategoryNode } from "@/src/entities/category";
import type { PublicListingsInitialState } from "@/src/screens/listings/model/public-listings-initial-state";
import { Container } from "@/src/shared/ui/container";
import { CategoryShowcaseCarouselSection } from "./category-showcase-carousel-section";
import { HomeListingsSection } from "./home-listings-section";

type HomePageProps = {
  initialCategories: CategoryNode[];
  initialCategoriesError: string | null;
  initialCategoryId?: string;
  initialListings: PublicListingsInitialState;
};

export function HomePage({
  initialCategories,
  initialCategoriesError,
  initialCategoryId,
  initialListings,
}: HomePageProps) {
  return (
    <main className="pb-12 pt-6">
      <Container>
        <CategoryShowcaseCarouselSection
          categories={initialCategories}
          errorMessage={initialCategoriesError}
        />

        <HomeListingsSection
          initialCategoryId={initialCategoryId}
          initialListings={initialListings}
        />
      </Container>
    </main>
  );
}
