import { MapPin } from "lucide-react";
import type { UserAddress } from "@/src/entities/user";
import type { ListingFormState } from "@/src/features/listing/model/use-listing-form-state";
import {
  ListingFormField,
  ListingFormSelect,
} from "@/src/features/listing/ui/listing-form-field";
import { ListingFormInlineHint } from "@/src/features/listing/ui/listing-form-inline-hint";
import { Input } from "@/src/shared/ui/shadcn/input";

export function ListingAddressSection({ state }: { state: ListingFormState }) {
  const {
    addressLine,
    addressMode,
    cities,
    cityId,
    handleAddressModeChange,
    handleRegionChange,
    isLoadingCities,
    isLoadingRegions,
    profileAddressId,
    regionId,
    regions,
    setAddressLine,
    setCityId,
    setProfileAddressId,
    userAddresses,
  } = state;

  return (
    <div className="border-t border-[var(--border-soft)] pt-6">
      <div className="flex items-center gap-3">
        <MapPin className="text-[var(--accent)]" size={20} />
        <p className="text-[1.35rem] font-black text-[var(--brand-deep)]">Адрес объявления</p>
      </div>
      <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
        Адрес сохранится в объявлении как snapshot. Если потом изменить профиль, уже созданное объявление не переедет само.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <AddressModeButton
          description="Быстрее всего, если адрес уже добавлен в профиле."
          isActive={addressMode === "profile"}
          label="Из профиля"
          onClick={() => handleAddressModeChange("profile")}
        />
        <AddressModeButton
          description="Регион, город и строка адреса только для этого объявления."
          isActive={addressMode === "custom"}
          label="Другой адрес"
          onClick={() => handleAddressModeChange("custom")}
        />
        <AddressModeButton
          description="Можно оставить для черновика или если место не важно."
          isActive={addressMode === "none"}
          label="Не указывать"
          onClick={() => handleAddressModeChange("none")}
        />
      </div>

      {addressMode === "profile" ? (
        <div className="mt-5">
          {userAddresses.length > 0 ? (
            <ListingFormField label="Адрес из профиля">
              <ListingFormSelect
                onChange={(value) => setProfileAddressId(value || null)}
                value={profileAddressId ?? ""}
              >
                <option value="">Выберите адрес</option>
                {userAddresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {formatUserAddress(address)}
                  </option>
                ))}
              </ListingFormSelect>
            </ListingFormField>
          ) : (
            <ListingFormInlineHint text="В профиле пока нет сохранённых адресов. Выберите «Другой адрес» и укажите место вручную." />
          )}
        </div>
      ) : null}

      {addressMode === "custom" ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <ListingFormField label="Регион">
            <ListingFormSelect
              disabled={isLoadingRegions}
              onChange={(value) => handleRegionChange(value === "" ? null : Number(value))}
              value={regionId ?? ""}
            >
              <option value="">
                {isLoadingRegions ? "Загружаем регионы..." : "Выберите регион"}
              </option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.fullName || region.name}
                </option>
              ))}
            </ListingFormSelect>
          </ListingFormField>

          <ListingFormField label="Город">
            <ListingFormSelect
              disabled={regionId === null || isLoadingCities}
              onChange={(value) => setCityId(value === "" ? null : Number(value))}
              value={cityId ?? ""}
            >
              <option value="">
                {regionId === null
                  ? "Сначала выберите регион"
                  : (isLoadingCities ? "Загружаем города..." : "Выберите город")}
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </ListingFormSelect>
          </ListingFormField>

          <div className="md:col-span-2">
            <ListingFormField label="Улица, дом или ориентир">
              <Input
                maxLength={255}
                onChange={(event) => setAddressLine(event.target.value)}
                placeholder="Например, Проспект Октября, 10"
                value={addressLine}
              />
            </ListingFormField>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AddressModeButton({
  description,
  isActive,
  label,
  onClick,
}: {
  description: string;
  isActive: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={[
        "rounded-2xl border px-4 py-4 text-left transition-colors duration-200",
        isActive
          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--brand-deep)] shadow-[var(--shadow-card)]"
          : "border-[var(--border-soft)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      <span className="text-sm font-black text-[var(--brand-deep)]">{label}</span>
      <span className="mt-2 block text-xs leading-5">{description}</span>
    </button>
  );
}

function formatUserAddress(address: UserAddress): string {
  return [
    address.region.fullName || address.region.name,
    address.city?.name,
    address.addressLine,
  ]
    .filter(Boolean)
    .join(", ");
}
