import { MapPin } from "lucide-react";

type ListingCardLocationProps = {
  className?: string;
  iconSize?: number;
  location: string;
};

export function ListingCardLocation({
  className = "inline-flex items-center gap-2",
  iconSize = 18,
  location,
}: ListingCardLocationProps) {
  return (
    <span className={className}>
      <MapPin className="shrink-0" size={iconSize} />
      <span className="truncate">{location}</span>
    </span>
  );
}
