import type { UserAddress } from "@/src/entities/user";

export function formatUserAddress(address: UserAddress): string {
  return [
    address.region.fullName || address.region.name,
    address.city?.name,
    address.addressLine,
  ]
    .filter(Boolean)
    .join(", ");
}
