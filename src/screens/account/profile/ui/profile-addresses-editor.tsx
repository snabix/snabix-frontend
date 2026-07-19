import { AlertCircle, MapPin, Plus } from "lucide-react";
import type { User, UserAddress } from "@/src/entities/user";
import { Button } from "@/src/shared/ui/shadcn/button";
import { EmptyState } from "@/src/shared/ui/empty-state";
import { SkeletonPanel } from "@/src/shared/ui/skeleton";
import { useProfileAddressesEditor } from "../model/use-profile-addresses-editor";
import { ProfileAddressDraftCard } from "./profile-address-draft-card";
import { ProfileAddressesHeading } from "./profile-addresses-view";

type ProfileAddressesEditorProps = {
  initialAddresses: UserAddress[];
  onUserChange: (user: User | null) => void;
  user: User | null;
};

export function ProfileAddressesEditor({
  initialAddresses,
  onUserChange,
  user,
}: ProfileAddressesEditorProps) {
  const {
    addAddress,
    canAddAddress,
    canSave,
    citiesByRegion,
    drafts,
    isRegionsLoading,
    isSaving,
    regions,
    regionsError,
    removeAddress,
    saveAddresses,
    setPrimaryAddress,
    updateDraft,
  } = useProfileAddressesEditor({
    initialAddresses,
    onUserChange,
    user,
  });

  return (
    <section className="surface-card rounded-[32px] p-6 sm:p-8">
      <ProfileAddressesHeading
        description="Добавьте один или несколько адресов. Позже при создании объявления мы будем предлагать выбор только из этих локаций."
        title="Где вы размещаете объявления"
      />

      <ProfileAddressesEditorContent
        addAddress={addAddress}
        citiesByRegion={citiesByRegion}
        drafts={drafts}
        isRegionsLoading={isRegionsLoading}
        regions={regions}
        regionsError={regionsError}
        removeAddress={removeAddress}
        setPrimaryAddress={setPrimaryAddress}
        updateDraft={updateDraft}
      />

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

type ProfileAddressesEditorContentProps = Pick<
  ReturnType<typeof useProfileAddressesEditor>,
  | "addAddress"
  | "citiesByRegion"
  | "drafts"
  | "isRegionsLoading"
  | "regions"
  | "regionsError"
  | "removeAddress"
  | "setPrimaryAddress"
  | "updateDraft"
>;

function ProfileAddressesEditorContent({
  addAddress,
  citiesByRegion,
  drafts,
  isRegionsLoading,
  regions,
  regionsError,
  removeAddress,
  setPrimaryAddress,
  updateDraft,
}: ProfileAddressesEditorContentProps) {
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
      {drafts.map((draft, index) => (
        <ProfileAddressDraftCard
          cities={draft.regionId ? (citiesByRegion[draft.regionId] ?? []) : []}
          draft={draft}
          index={index}
          key={draft.id ?? `new-${index}`}
          onPrimaryChange={setPrimaryAddress}
          onRemove={removeAddress}
          onUpdate={updateDraft}
          regions={regions}
        />
      ))}
    </div>
  );
}
