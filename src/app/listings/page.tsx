import { PublicListingsPage } from "@/src/screens/listings/ui/public-listings-page";

type ListingsRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ListingsRoute({
  searchParams,
}: ListingsRouteProps) {
  const params = await searchParams;
  const categoryId = parseCategoryId(params.categoryId);

  return (
    <PublicListingsPage
      initialCategoryId={categoryId}
      key={categoryId ?? "all"}
    />
  );
}

function parseCategoryId(value: string | string[] | undefined): number | undefined {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (!rawValue) {
    return undefined;
  }

  const parsedValue = Number(rawValue);

  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : undefined;
}
