import { Trash2 } from "lucide-react";
import type { LocationCity, LocationRegion } from "@/src/entities/location";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Checkbox } from "@/src/shared/ui/shadcn/checkbox";
import { Input } from "@/src/shared/ui/shadcn/input";
import { Label } from "@/src/shared/ui/shadcn/label";
import type { AddressDraft } from "../model/profile-addresses-types";

type ProfileAddressDraftCardProps = {
  cities: LocationCity[];
  draft: AddressDraft;
  index: number;
  onPrimaryChange: (index: number, isPrimary: boolean) => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, patch: Partial<AddressDraft>) => void;
  regions: LocationRegion[];
};

export function ProfileAddressDraftCard({
  cities,
  draft,
  index,
  onPrimaryChange,
  onRemove,
  onUpdate,
  regions,
}: ProfileAddressDraftCardProps) {
  const fieldIdPrefix = `profile-address-${index}`;

  return (
    <div className="rounded-[28px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-4 shadow-sm">
      <div className="mb-4 flex justify-end">
        <Button
          aria-label="Удалить адрес"
          className="size-10 rounded-2xl"
          onClick={() => onRemove(index)}
          type="button"
          variant="ghost"
        >
          <Trash2 aria-hidden="true" size={16} />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor={`${fieldIdPrefix}-region`}>Регион</Label>
          <select
            autoComplete="address-level1"
            className="h-12 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--brand-deep)] outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
            id={`${fieldIdPrefix}-region`}
            onChange={(event) => onUpdate(index, { regionId: event.target.value })}
            value={draft.regionId}
          >
            <option value="">Выберите регион</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.fullName || region.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`${fieldIdPrefix}-city`}>Город</Label>
          <select
            autoComplete="address-level2"
            className="h-12 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--brand-deep)] outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)] disabled:opacity-60"
            disabled={!draft.regionId}
            id={`${fieldIdPrefix}-city`}
            onChange={(event) => onUpdate(index, { cityId: event.target.value })}
            value={draft.cityId}
          >
            <option value="">Весь регион</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`${fieldIdPrefix}-address-line`}>Улица и дом</Label>
          <Input
            autoComplete="address-line1"
            id={`${fieldIdPrefix}-address-line`}
            onChange={(event) => onUpdate(index, { addressLine: event.target.value })}
            placeholder="Например: ул. Ленина, 10"
            value={draft.addressLine}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor={`${fieldIdPrefix}-label`}>Название</Label>
          <Input
            id={`${fieldIdPrefix}-label`}
            onChange={(event) => onUpdate(index, { label: event.target.value })}
            placeholder="Дом, офис, склад"
            value={draft.label}
          />
        </div>
      </div>

      <div className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_76%,transparent)] px-4 py-3 text-sm font-bold text-[var(--brand-deep)]">
        <Checkbox
          checked={draft.isPrimary}
          id={`${fieldIdPrefix}-primary`}
          onCheckedChange={(checked) => onPrimaryChange(index, checked === true)}
        />
        <Label htmlFor={`${fieldIdPrefix}-primary`}>Приоритетный адрес</Label>
      </div>
    </div>
  );
}
