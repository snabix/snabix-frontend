import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PublicListingItem } from "@/src/entities/listing";
import { showPublicListingServer } from "@/src/features/listing/api/server-public-listings";
import {
  PublicListingDetailsPage,
  PublicListingUnavailablePage,
} from "@/src/screens/listings/details/ui/public-listing-details-page";
import { isServerApiError } from "@/src/shared/api/server-request";

type PublicListingDetailsRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: PublicListingDetailsRouteProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const listing = await showPublicListingServer(id);
    const price = listing.priceAmountMinor === null
      ? null
      : `${new Intl.NumberFormat("ru-RU").format(listing.priceAmountMinor)} ${listing.priceCurrency ?? "RUB"}`;
    const description = truncateDescription(listing.description, 160);
    const title = price === null
      ? listing.title
      : `${listing.title} — ${price}`;
    const images = listing.imageUrl ? [{ url: listing.imageUrl }] : [];

    return {
      title,
      description,
      openGraph: {
        title: `${title} | SNABIX`,
        description,
        images,
        type: "website",
      },
      twitter: {
        card: images.length > 0 ? "summary_large_image" : "summary",
        title: `${title} | SNABIX`,
        description,
        images,
      },
    };
  } catch {
    return {
      title: "Объявление",
      description: "Публичное объявление на SNABIX.",
    };
  }
}

export default async function PublicListingDetailsRoute({ params }: PublicListingDetailsRouteProps) {
  const { id } = await params;
  let listing: PublicListingItem;

  try {
    listing = await showPublicListingServer(id);
  } catch (error) {
    if (isServerApiError(error) && error.status === 404) {
      notFound();
    }

    return <PublicListingUnavailablePage />;
  }

  return <PublicListingDetailsPage listing={listing} />;
}

function truncateDescription(value: string, maxLength: number): string {
  const normalizedValue = value.replace(/\s+/g, " ").trim();

  return normalizedValue.length <= maxLength
    ? normalizedValue
    : `${normalizedValue.slice(0, maxLength - 1).trimEnd()}…`;
}
