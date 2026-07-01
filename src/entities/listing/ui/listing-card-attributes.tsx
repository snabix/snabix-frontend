import type { ListingCardPresentation } from "./listing-card-types";

type ListingCardAttributesProps = {
  attributes: ListingCardPresentation["highlightedAttributes"];
};

export function ListingCardAttributes({ attributes }: ListingCardAttributesProps) {
  if (attributes.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      {attributes.map((attribute) => (
        <span
          className="rounded-full border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--background)_40%,white)] px-3.5 py-2 text-xs font-bold text-[var(--brand-deep)]"
          key={attribute.attributeDefinitionId}
        >
          <span className="text-[var(--text-muted)]">
            {attribute.name}
          </span>{" "}
          {attribute.displayValue}
        </span>
      ))}
    </div>
  );
}
