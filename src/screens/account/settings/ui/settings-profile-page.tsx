"use client";

import { Camera, Save, ShieldCheck, UserRound } from "lucide-react";
import { useUserStore } from "@/src/entities/user";
import { useAvatarEditor } from "@/src/screens/account/profile/model/use-avatar-editor";
import { useProfileEditor } from "@/src/screens/account/profile/model/use-profile-editor";
import { ProfileAvatarViewer } from "@/src/screens/account/profile/ui/profile-avatar-viewer";
import { FormField } from "@/src/shared/ui/form-field";
import { Button } from "@/src/shared/ui/shadcn/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/ui/shadcn/avatar";
import { Input } from "@/src/shared/ui/shadcn/input";
import { SettingsSection } from "./settings-shared";

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

        <div className="mb-5 flex gap-3 border-b border-[var(--border-soft)] pb-5 text-sm leading-6 text-[var(--text-muted)]">
          <ShieldCheck className="mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden="true" size={18} />
          <p>
            Аватар, дата рождения и описание являются персональными данными.
            Заполняйте только те сведения, которые готовы хранить в профиле.
          </p>
        </div>

        <form
          autoComplete="on"
          className="grid gap-5"
          noValidate
          onSubmit={handleSubmit(handleProfileSubmit)}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              error={errors.firstName?.message}
              id="settings-first-name"
              label="Имя"
              labelClassName="pl-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]"
            >
              {(controlProps) => (
                <Input
                  {...controlProps}
                  autoComplete="given-name"
                  placeholder="Ваше имя"
                  required
                  {...register("firstName")}
                />
              )}
            </FormField>

            <FormField
              error={errors.lastName?.message}
              id="settings-last-name"
              label="Фамилия"
              labelClassName="pl-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]"
            >
              {(controlProps) => (
                <Input
                  {...controlProps}
                  autoComplete="family-name"
                  placeholder="Ваша фамилия"
                  required
                  {...register("lastName")}
                />
              )}
            </FormField>

            <FormField
              error={errors.dateOfBirth?.message}
              id="settings-date-of-birth"
              label="Дата рождения"
              labelClassName="pl-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]"
            >
              {(controlProps) => (
                <Input
                  {...controlProps}
                  autoComplete="bday"
                  type="date"
                  {...register("dateOfBirth")}
                />
              )}
            </FormField>
          </div>

          <FormField
            error={errors.description?.message}
            id="settings-description"
            label="О себе"
            labelClassName="pl-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]"
          >
            {(controlProps) => (
              <textarea
                {...controlProps}
                className="profile-edit-input min-h-32 w-full resize-y px-4 py-3 text-sm text-[var(--brand-deep)] focus-visible:outline-none"
                placeholder="Расскажите, чем занимаетесь, с какими товарами или услугами работаете"
                {...register("description")}
              />
            )}
          </FormField>

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
