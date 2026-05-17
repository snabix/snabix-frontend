import { EditListingPage } from "@/src/screens/account/listings/edit/ui/edit-listing-page";

type EditListingRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditListingRoute({ params }: EditListingRouteProps) {
  const { id } = await params;

  return <EditListingPage listingId={id} />;
}
