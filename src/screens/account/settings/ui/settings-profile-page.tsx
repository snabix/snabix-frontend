"use client";

import { Camera, Save, ShieldCheck, UserRound } from "lucide-react";
import { useUserStore } from "@/src/entities/user";
import { useAvatarEditor } from "@/src/screens/account/profile/model/use-avatar-editor";
import { useProfileEditor } from "@/src/screens/account/profile/model/use-profile-editor";
import { ProfileEditField } from "@/src/screens/account/profile/ui/profile-parts";
import { ProfileAvatarViewer } from "@/src/screens/account/profile/ui/profile-avatar-viewer";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/ui/shadcn/avatar";
import { Input } from "@/src/shared/ui/shadcn/input";
import { Label } from "@/src/shared/ui/shadcn/label";
import { FieldError, SettingsSection } from "./settings-shared";

export function ProfileSettingsPage() {
  const user = useUserStore((state) => state.user);
  const {
    errors,
    handleProfileSubmit,
    handleSubmit,
    isSubmitting,
    register,
  } = useProfileEditor({
    onEmailVerificationRequired: () => undefined,
  });
  const {
    avatarDraft,
    avatarInputRef,
    avatarOffset,
    avatarScale,
    handleAvatarChange,
    handleAvatarMovePointerDown,
    handleAvatarSave,
    handleAvatarSelect,
    handleAvatarViewerClose,
    isAvatarSubmitting,
    isAvatarViewerOpen,
    resetAvatarDraft,
    setAvatarScale,
  } = useAvatarEditor();

  return (
    <>
      <SettingsSection
        description="Здесь находятся данные профиля, которые пользователь может обновлять самостоятельно."
        icon={UserRound}
        title="Профиль"
      >
        <div className="mb-5 flex flex-col gap-4 rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="grid size-20 place-items-center rounded-full text-[var(--background)] shadow-[var(--shadow-card)]">
              <AvatarImage src={user?.avatar?.url ?? undefined} />
              <AvatarFallback>
                <UserRound aria-hidden="true" size={32} strokeWidth={2.15} />
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="font-heading text-lg font-black text-[var(--brand-deep)]">
                Аватар профиля
              </h2>
              <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
                Изображение относится к персональным данным и может отображаться в профиле.
              </p>
            </div>
          </div>

          <Button
            className="w-fit rounded-2xl"
            disabled={isAvatarSubmitting}
            onClick={handleAvatarSelect}
            type="button"
            variant="outline"
          >
            <Camera size={17} />
            {isAvatarSubmitting ? "Загружаем..." : "Загрузить"}
          </Button>

          <input
            ref={avatarInputRef}
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleAvatarChange}
            type="file"
          />
        </div>

        <div className="mb-5 flex gap-3 rounded-[22px] border border-[color-mix(in_srgb,var(--accent)_32%,var(--border-soft))] bg-[var(--accent-soft)] p-4 text-sm leading-6 text-[var(--brand-deep)]">
          <ShieldCheck className="mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden="true" size={18} />
          <p>
            Дата рождения, описание и аватар являются персональными данными.
            Заполняйте только те сведения, которые готовы хранить в профиле.
          </p>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit(handleProfileSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <ProfileEditField label="Имя">
              <Label className="sr-only" htmlFor="settings-first-name">
                Имя
              </Label>
              <Input id="settings-first-name" placeholder="Ваше имя" {...register("firstName")} />
              <FieldError message={errors.firstName?.message} />
            </ProfileEditField>

            <ProfileEditField label="Фамилия">
              <Label className="sr-only" htmlFor="settings-last-name">
                Фамилия
              </Label>
              <Input id="settings-last-name" placeholder="Ваша фамилия" {...register("lastName")} />
              <FieldError message={errors.lastName?.message} />
            </ProfileEditField>

            <ProfileEditField label="Дата рождения">
              <Label className="sr-only" htmlFor="settings-date-of-birth">
                Дата рождения
              </Label>
              <Input
                id="settings-date-of-birth"
                type="date"
                {...register("dateOfBirth")}
              />
              <FieldError message={errors.dateOfBirth?.message} />
            </ProfileEditField>
          </div>

          <ProfileEditField label="О себе">
            <Label className="sr-only" htmlFor="settings-description">
              О себе
            </Label>
            <textarea
              className="profile-edit-input min-h-32 w-full resize-y px-4 py-3 text-sm text-[var(--brand-deep)] focus-visible:outline-none"
              id="settings-description"
              placeholder="Расскажите, чем занимаетесь, с какими товарами или услугами работаете"
              {...register("description")}
            />
            <FieldError message={errors.description?.message} />
          </ProfileEditField>

          <div className="flex justify-end">
            <Button className="w-fit rounded-2xl" disabled={isSubmitting} type="submit">
              <Save size={17} />
              {isSubmitting ? "Сохраняем..." : "Сохранить профиль"}
            </Button>
          </div>
        </form>
      </SettingsSection>

      {isAvatarViewerOpen && avatarDraft ? (
        <ProfileAvatarViewer
          avatarDraft={avatarDraft}
          avatarOffset={avatarOffset}
          avatarScale={avatarScale}
          isAvatarSubmitting={isAvatarSubmitting}
          onAvatarDraftResetAction={resetAvatarDraft}
          onAvatarMovePointerDownAction={handleAvatarMovePointerDown}
          onAvatarSaveAction={handleAvatarSave}
          onAvatarScaleChangeAction={(value) => setAvatarScale(value[0] ?? 1)}
          onAvatarViewerCloseAction={handleAvatarViewerClose}
        />
      ) : null}
    </>
  );
}
