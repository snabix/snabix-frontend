import { ListingDetailsPage } from "@/src/screens/account/listings/details/ui/listing-details-page";

type ListingDetailsRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ListingDetailsRoute({ params }: ListingDetailsRouteProps) {
  const { id } = await params;

  return <ListingDetailsPage listingId={id} />;
}
