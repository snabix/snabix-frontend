import { PublicListingDetailsPage } from "@/src/screens/listings/details/ui/public-listing-details-page";

type PublicListingDetailsRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PublicListingDetailsRoute({ params }: PublicListingDetailsRouteProps) {
  const { id } = await params;

  return <PublicListingDetailsPage listingId={id} />;
}
