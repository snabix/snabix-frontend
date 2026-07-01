"use client";

import { type UserAddress, useUserStore } from "@/src/entities/user";
import { ProfileAddressesEditor } from "./profile-addresses-editor";
import { ProfileAddressesView } from "./profile-addresses-view";

type ProfileAddressesSectionProps = {
  mode?: "edit" | "view";
};

export function ProfileAddressesSection({
  mode = "edit",
}: ProfileAddressesSectionProps) {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const addresses = user?.addresses ?? [];
  const addressesKey = buildAddressesKey(addresses);

  if (mode === "view") {
    return <ProfileAddressesView addresses={addresses} />;
  }

  return (
    <ProfileAddressesEditor
      initialAddresses={addresses}
      key={addressesKey}
      onUserChange={setUser}
      user={user}
    />
  );
}

function buildAddressesKey(addresses: UserAddress[]): string {
  return addresses
    .map((address) => [
      address.id,
      address.region.id,
      address.city?.id ?? "",
      address.label ?? "",
      address.addressLine ?? "",
      address.isPrimary ? "1" : "0",
    ].join(":"))
    .join("|");
}
