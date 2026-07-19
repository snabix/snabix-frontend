import type { ListingItem } from "@/src/entities/listing";

export type CategoryBreadcrumb = {
  id: string | number;
  name: string;
  slug: string;
};

export function buildCategoryBreadcrumbs(listing: ListingItem): CategoryBreadcrumb[] {
  if (listing.category === null) {
    return [];
  }

  if (listing.category.breadcrumbs !== undefined && listing.category.breadcrumbs.length > 0) {
    return listing.category.breadcrumbs;
  }

  const rawPath = listing.category.fullName ?? listing.category.path ?? listing.category.name;
  const names = rawPath
    .split(/[/>]/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  return names.map((name, index) => ({
    id: index === names.length - 1 ? listing.category?.id ?? name : name,
    name,
    slug: name,
  }));
}

export function buildFullLocation(listing: ListingItem): string {
  if (listing.location !== null && listing.location !== undefined) {
    return [
      listing.location.region.fullName || listing.location.region.name,
      listing.location.city?.name,
      listing.location.addressLine,
    ].filter(Boolean).join(", ") || "Локация не указана";
  }

  const location = [
    listing.region,
    listing.city,
    listing.addressLine ?? [listing.street, listing.house].filter(Boolean).join(", "),
  ].filter(Boolean).join(", ");

  if (location) {
    return location;
  }

  if (listing.fullLocation) {
    return listing.fullLocation;
  }

  return "Локация не указана";
}

export function buildListingDetailPairs(listing: ListingItem): Array<[string, string]> {
  const basePairs = [
    ["Тип объявления", listing.listingKindLabel],
    ["Состояние", listing.itemConditionLabel],
    ["Торг уместен", listing.isNegotiable ? "Да" : "Нет"],
  ] as Array<[string, string]>;

  const attributePairs = listing.attributeValues
    .filter((attribute) => attribute.displayValue)
    .slice(0, 4)
    .map((attribute) => [attribute.name ?? "Параметр", attribute.displayValue ?? "-"] as [string, string]);

  return [...basePairs, ...attributePairs];
}

export function formatListingPrice(listing: ListingItem): string {
  if (listing.priceAmountMinor === null) {
    return "Цена не указана";
  }

  return `${new Intl.NumberFormat("ru-RU").format(listing.priceAmountMinor)} ${listing.priceCurrency ?? "₽"}`;
}

export function formatDateTime(value: string | null): string {
  if (value === null) {
    return "Не указано";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}
