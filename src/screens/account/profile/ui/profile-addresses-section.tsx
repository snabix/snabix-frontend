"use client";

import { useEffect, useState } from "react";
import { AlertCircle, MapPin, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { listCities, listRegions, type LocationCity, type LocationRegion } from "@/src/entities/location";
import { type UserAddress, useUserStore } from "@/src/entities/user";
import { replaceProfileAddresses, type ProfileAddressFormItem } from "@/src/features/profile";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Checkbox } from "@/src/shared/ui/shadcn/checkbox";
import { Input } from "@/src/shared/ui/shadcn/input";
import { Label } from "@/src/shared/ui/shadcn/label";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { SkeletonPanel } from "@/src/shared/ui/skeleton";

type ProfileAddressesSectionProps = {
  mode?: "edit" | "view";
};

type AddressDraft = {
  id?: string;
  regionId: string;
  cityId: string;
  label: string;
  addressLine: string;
  isPrimary: boolean;
};

type CitiesByRegion = Record<string, LocationCity[]>;

export function ProfileAddressesSection({
  mode = "edit",
}: ProfileAddressesSectionProps) {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const addresses = user?.addresses ?? [];
  const addressesKey = addresses
    .map((address) => [
      address.id,
      address.region.id,
      address.city?.id ?? "",
      address.label ?? "",
      address.addressLine ?? "",
      address.isPrimary ? "1" : "0",
    ].join(":"))
    .join("|");

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

function ProfileAddressesView({ addresses }: { addresses: UserAddress[] }) {
  return (
    <section className="surface-card rounded-[32px] p-6 sm:p-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <MapPin aria-hidden="true" size={20} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Адреса
          </p>

          <h2 className="font-heading mt-1 text-2xl font-extrabold text-[var(--brand-deep)]">
            Ваши локации
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
            Управлять адресами можно в настройках аккаунта, а здесь они отображаются только для просмотра.
          </p>
        </div>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          description="Адреса пока не добавлены. Добавить их можно в настройках профиля."
          icon={MapPin}
          title="Адреса пока не указаны"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <article
              className="rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-5"
              key={address.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-lg font-black text-[var(--brand-deep)]">
                    {formatUserAddress(address)}
                  </h3>
                  {address.label?.trim() ? (
                    <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                      {address.label}
                    </p>
                  ) : null}
                </div>

                {address.isPrimary ? (
                  <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-black text-[var(--brand-deep)]">
                    основной
                  </span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
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

type ProfileAddressesEditorProps = {
  initialAddresses: UserAddress[];
  onUserChange: ReturnType<typeof useUserStore.getState>["setUser"];
  user: ReturnType<typeof useUserStore.getState>["user"];
};

function ProfileAddressesEditor({
  initialAddresses,
  onUserChange,
  user,
}: ProfileAddressesEditorProps) {
  const [regions, setRegions] = useState<LocationRegion[]>([]);
  const [citiesByRegion, setCitiesByRegion] = useState<CitiesByRegion>({});
  const [drafts, setDrafts] = useState<AddressDraft[]>(() => toDrafts(initialAddresses));
  const [isRegionsLoading, setIsRegionsLoading] = useState(true);
  const [regionsError, setRegionsError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    listRegions()
      .then((items) => {
        if (isMounted) {
          setRegions(items);
          setRegionsError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRegionsError("Не удалось загрузить регионы.");
          toast.error("Не удалось загрузить регионы.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsRegionsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const regionIds = [...new Set(drafts.map((draft) => draft.regionId).filter(Boolean))];

    regionIds.forEach((regionId) => {
      if (citiesByRegion[regionId]) {
        return;
      }

      listCities({ regionId: Number(regionId) })
        .then((items) => {
          setCitiesByRegion((current) => ({
            ...current,
            [regionId]: items,
          }));
        })
        .catch(() => {
          toast.error("Не удалось загрузить города.");
        });
    });
  }, [citiesByRegion, drafts]);

  const updateDraft = (index: number, patch: Partial<AddressDraft>) => {
    setDrafts((current) => current.map((draft, draftIndex) => {
      if (draftIndex !== index) {
        return draft;
      }

      return {
        ...draft,
        ...patch,
        cityId: patch.regionId !== undefined ? "" : (patch.cityId ?? draft.cityId),
      };
    }));
  };

  const addAddress = () => {
    setDrafts((current) => [
      ...current,
      {
        regionId: "",
        cityId: "",
        label: "",
        addressLine: "",
        isPrimary: current.length === 0,
      },
    ]);
  };

  const removeAddress = (index: number) => {
    setDrafts((current) => {
      const next = current.filter((_, draftIndex) => draftIndex !== index);

      if (next.length > 0 && !next.some((draft) => draft.isPrimary)) {
        next[0] = {
          ...next[0],
          isPrimary: true,
        };
      }

      return next;
    });
  };

  const setPrimaryAddress = (index: number, isPrimary: boolean) => {
    setDrafts((current) => current.map((draft, draftIndex) => ({
      ...draft,
      isPrimary: isPrimary ? draftIndex === index : (draftIndex === index ? false : draft.isPrimary),
    })));
  };

  const saveAddresses = async () => {
    setIsSaving(true);

    try {
      const addresses = await replaceProfileAddresses(toPayload(drafts));

      if (user) {
        onUserChange({
          ...user,
          addresses,
        });
      }

      toast.success("Адреса профиля обновлены.");
    } catch (error) {
      toast.error(extractApiError(error, "Не удалось сохранить адреса."));
    } finally {
      setIsSaving(false);
    }
  };

  const renderAddressesContent = () => {
    if (isRegionsLoading) {
      return (
        <SkeletonPanel className="border border-dashed border-[var(--border-soft)] shadow-none" />
      );
    }

    if (regionsError !== null) {
      return (
        <EmptyState
          action={
            <Button
              onClick={() => window.location.reload()}
              type="button"
              variant="secondary"
            >
              Обновить страницу
            </Button>
          }
          description="Без списка регионов нельзя корректно добавить адрес. Попробуйте обновить страницу или вернуться позже."
          icon={AlertCircle}
          title="Адреса временно недоступны"
        />
      );
    }

    if (drafts.length === 0) {
      return (
        <EmptyState
          action={
            <Button
              className="rounded-2xl"
              onClick={addAddress}
              type="button"
            >
              <Plus aria-hidden="true" size={16} />
              Добавить первый адрес
            </Button>
          }
          description="Добавьте город или регион один раз, чтобы позже быстрее создавать объявления и не выбирать локацию заново."
          icon={MapPin}
          title="Адреса пока не добавлены"
        />
      );
    }

    return (
      <div className="grid gap-4">
        {drafts.map((draft, index) => {
          const cities = draft.regionId ? (citiesByRegion[draft.regionId] ?? []) : [];

          return (
            <div
              className="rounded-[28px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-4 shadow-sm"
              key={draft.id ?? `new-${index}`}
            >
              <div className="mb-4 flex justify-end">
                <Button
                  aria-label="Удалить адрес"
                  className="size-10 rounded-2xl"
                  onClick={() => removeAddress(index)}
                  type="button"
                  variant="ghost"
                >
                  <Trash2 aria-hidden="true" size={16} />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Регион</Label>
                  <select
                    className="h-12 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--brand-deep)] outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)]"
                    onChange={(event) => updateDraft(index, { regionId: event.target.value })}
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
                  <Label>Город</Label>
                  <select
                    className="h-12 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--brand-deep)] outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent-soft)] disabled:opacity-60"
                    disabled={!draft.regionId}
                    onChange={(event) => updateDraft(index, { cityId: event.target.value })}
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
                  <Label>Улица и дом</Label>
                  <Input
                    onChange={(event) => updateDraft(index, { addressLine: event.target.value })}
                    placeholder="Например: ул. Ленина, 10"
                    value={draft.addressLine}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Название</Label>
                  <Input
                    onChange={(event) => updateDraft(index, { label: event.target.value })}
                    placeholder="Дом, офис, склад"
                    value={draft.label}
                  />
                </div>
              </div>

              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_76%,transparent)] px-4 py-3 text-sm font-bold text-[var(--brand-deep)]">
                <Checkbox
                  checked={draft.isPrimary}
                  onCheckedChange={(checked) => setPrimaryAddress(index, checked === true)}
                />
                Приоритетный адрес
              </label>
            </div>
          );
        })}
      </div>
    );
  };

  const canSave = !isRegionsLoading && regionsError === null && !isSaving;
  const canAddAddress = !isRegionsLoading && regionsError === null;

  return (
    <section className="surface-card rounded-[32px] p-6 sm:p-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <MapPin aria-hidden="true" size={20} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Адреса
          </p>

          <h2 className="font-heading mt-1 text-2xl font-extrabold text-[var(--brand-deep)]">
            Где вы размещаете объявления
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
            Добавьте один или несколько адресов. Позже при создании объявления
            мы будем предлагать выбор только из этих локаций.
          </p>
        </div>
      </div>

      {renderAddressesContent()}

      {drafts.length > 0 && canAddAddress ? (
        <div className="mt-5">
          <Button
            className="h-11 rounded-2xl px-4"
            onClick={addAddress}
            type="button"
            variant="secondary"
          >
            <Plus aria-hidden="true" size={16} />
            Добавить адрес
          </Button>
        </div>
      ) : null}

      <div className="mt-6 flex justify-end">
        <Button
          className="h-12 rounded-2xl px-6"
          disabled={!canSave}
          onClick={saveAddresses}
          type="button"
        >
          {isSaving ? "Сохраняем..." : "Сохранить адреса"}
        </Button>
      </div>
    </section>
  );
}

function toDrafts(addresses: UserAddress[]): AddressDraft[] {
  return addresses.map((address) => ({
    id: address.id,
    regionId: String(address.region.id),
    cityId: address.city ? String(address.city.id) : "",
    label: address.label ?? "",
    addressLine: address.addressLine ?? "",
    isPrimary: address.isPrimary,
  }));
}

function toPayload(drafts: AddressDraft[]): ProfileAddressFormItem[] {
  return drafts
    .filter((draft) => draft.regionId)
    .map((draft, index) => ({
      id: draft.id,
      regionId: Number(draft.regionId),
      cityId: draft.cityId ? Number(draft.cityId) : null,
      label: draft.label.trim() || null,
      addressLine: draft.addressLine.trim() || null,
      isPrimary: draft.isPrimary || index === 0,
    }));
}
