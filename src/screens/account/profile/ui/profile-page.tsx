"use client";

import {
    Camera,
    ChevronRight,
    KeyRound,
    Mail,
    MapPin,
    Pencil,
    Phone,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { useUserStore } from "@/src/entities/user";
import { ChangePasswordForm } from "@/src/features/auth/ui/change-password-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/ui/shadcn/avatar";
import { Button } from "@/src/shared/ui/shadcn/button";
import { useAvatarEditor } from "@/src/screens/account/profile/model/use-avatar-editor";
import { useEmailVerification } from "@/src/screens/account/profile/model/use-email-verification";
import { useProfileEditor } from "@/src/screens/account/profile/model/use-profile-editor";
import {
    EmailVerificationBadge,
    ProfileDataField,
    ProfileSectionHeader,
    ProfileStatusPill,
} from "@/src/screens/account/profile/ui/profile-parts";
import { EmailVerificationDialog } from "@/src/screens/account/profile/ui/email-verification-dialog";
import { ProfileAvatarViewer } from "@/src/screens/account/profile/ui/profile-avatar-viewer";
import { ProfileEditDialog } from "@/src/screens/account/profile/ui/profile-edit-dialog";

export function ProfilePage() {
    const user = useUserStore((state) => state.user);
    const {
        handleConfirmVerification,
        handleResendVerification,
        handleVerificationCodeChange,
        isConfirmingVerification,
        isEmailVerified,
        isResendingVerification,
        isVerificationDialogOpen,
        openVerificationDialog,
        resendCooldownSeconds,
        setIsVerificationDialogOpen,
        verificationCode,
    } = useEmailVerification();
    const {
        errors,
        handleCancel,
        handleEdit,
        handleProfileSubmit,
        handleSubmit,
        isProfileModalOpen,
        isSubmitting,
        register,
    } = useProfileEditor({
        onEmailVerificationRequired: openVerificationDialog,
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
        setIsAvatarViewerOpen,
    } = useAvatarEditor();

    return (
        <>
            <div className="grid gap-6">
                <section className="surface-card relative overflow-hidden rounded-[34px] p-6 sm:p-8">
                    <div className="pointer-events-none absolute -right-12 -top-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--brand)_22%,transparent),transparent_72%)]" />
                    <div className="pointer-events-none absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--foreground)_12%,transparent),transparent_72%)]" />

                    <div className="relative flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex items-start gap-5">
                            <div className="relative shrink-0">
                                <button
                                    aria-label="Открыть аватар профиля"
                                    className={[
                                        "relative grid size-24 place-items-center rounded-full",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2",
                                    ].join(" ")}
                                    disabled={isAvatarSubmitting}
                                    onClick={() => setIsAvatarViewerOpen(true)}
                                    type="button"
                                >
                                    <Avatar className="grid size-24 place-items-center rounded-full border-4 border-[color-mix(in_srgb,var(--surface)_88%,transparent)] text-[var(--background)] shadow-[var(--shadow-card)]">
                                        <AvatarImage src={user?.avatar?.url ?? undefined} />
                                        <AvatarFallback>
                                            <UserRound
                                                aria-hidden="true"
                                                size={42}
                                                strokeWidth={2.15}
                                            />
                                        </AvatarFallback>
                                    </Avatar>
                                </button>

                                <button
                                    aria-label="Загрузить новый аватар"
                                    className="absolute -bottom-1 -right-1 grid size-9 place-items-center rounded-full border-2 border-[var(--surface)] bg-[var(--active-button-bg)] text-[var(--active-button-text)] shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
                                    disabled={isAvatarSubmitting}
                                    onClick={handleAvatarSelect}
                                    type="button"
                                >
                                    <Camera aria-hidden="true" size={15} />
                                </button>

                                <input
                                    ref={avatarInputRef}
                                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                    type="file"
                                />
                            </div>

                            <div className="max-w-2xl">
                                <div className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                                    Личный кабинет
                                </div>

                                <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--text-muted)]">
                                    Управляйте своими контактами, аватаром и базовой информацией аккаунта в одном месте.
                                </p>

                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    <EmailVerificationBadge verified={isEmailVerified} />

                                    <ProfileStatusPill tone={user?.isActive ? "success" : "danger"}>
                                        <ShieldCheck aria-hidden="true" size={15} />
                                        {user?.isActive ? "Аккаунт активен" : "Аккаунт отключен"}
                                    </ProfileStatusPill>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3 xl:min-w-[260px]">
                            <Button
                                className="h-12 rounded-2xl px-5 text-[var(--active-button-text)]"
                                onClick={handleEdit}
                                type="button"
                            >
                                <Pencil aria-hidden="true" size={16} />
                                Редактировать профиль
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="surface-card rounded-[32px] p-6 sm:p-8">
                    <ProfileSectionHeader />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <ProfileDataField
                            icon={UserRound}
                            label="Имя"
                            value={user?.firstName}
                        />
                        <ProfileDataField
                            icon={UserRound}
                            label="Фамилия"
                            value={user?.lastName}
                        />
                        <ProfileDataField
                            icon={Mail}
                            label="Email"
                        >
                            <div className="grid gap-2">
                                <p className="text-base font-extrabold leading-6 text-[var(--brand-deep)]">
                                    {user?.email?.trim() ? user.email : "Не указано"}
                                </p>

                                {!isEmailVerified && user?.email ? (
                                    <button
                                        className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] transition-opacity hover:opacity-80"
                                        onClick={() => setIsVerificationDialogOpen(true)}
                                        type="button"
                                    >
                                        Подтвердить email
                                        <ChevronRight aria-hidden="true" size={15} />
                                    </button>
                                ) : null}
                            </div>
                        </ProfileDataField>
                        <ProfileDataField
                            icon={Phone}
                            label="Телефон"
                            value={user?.phoneNumber}
                        />
                    </div>
                </section>

                <section className="surface-card rounded-[32px] p-6 sm:p-8">
                    <div className="mb-6 flex items-start gap-3">
                        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                            <MapPin aria-hidden="true" size={20} />
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                                Адресация
                            </p>

                            <h2 className="font-heading mt-1 text-2xl font-extrabold text-[var(--brand-deep)]">
                                Местоположение
                            </h2>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <ProfileDataField
                            icon={MapPin}
                            label="Регион"
                            value={user?.region}
                        />
                        <ProfileDataField
                            icon={MapPin}
                            label="Город"
                            value={user?.city}
                        />
                    </div>
                </section>

                <section className="surface-card rounded-[32px] p-6 sm:p-8">
                    <div className="mb-6 flex items-start gap-3">
                        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                            <KeyRound aria-hidden="true" size={20} />
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                                Безопасность
                            </p>

                            <h2 className="font-heading mt-1 text-2xl font-extrabold text-[var(--brand-deep)]">
                                Смена пароля
                            </h2>

                            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
                                Обновите пароль, если хотите усилить защиту аккаунта
                                или подозреваете, что текущий пароль мог стать известен
                                кому-то еще.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-xl">
                        <ChangePasswordForm />
                    </div>
                </section>
            </div>

            {isAvatarViewerOpen ? (
                <ProfileAvatarViewer
                    avatarDraft={avatarDraft}
                    avatarOffset={avatarOffset}
                    avatarScale={avatarScale}
                    avatarUrl={user?.avatar?.url}
                    isAvatarSubmitting={isAvatarSubmitting}
                    onAvatarDraftReset={resetAvatarDraft}
                    onAvatarMovePointerDown={handleAvatarMovePointerDown}
                    onAvatarSave={handleAvatarSave}
                    onAvatarScaleChange={(value) => setAvatarScale(value[0] ?? 1)}
                    onAvatarSelect={handleAvatarSelect}
                    onAvatarViewerClose={handleAvatarViewerClose}
                />
            ) : null}

            <ProfileEditDialog
                errors={errors}
                handleCancel={handleCancel}
                handleSubmit={handleSubmit}
                isOpen={isProfileModalOpen}
                isSubmitting={isSubmitting}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        handleCancel();
                    }
                }}
                onSubmit={handleProfileSubmit}
                register={register}
            />

            {user?.email && !isEmailVerified ? (
                <EmailVerificationDialog
                    code={verificationCode}
                    cooldownSeconds={resendCooldownSeconds}
                    email={user.email}
                    isConfirming={isConfirmingVerification}
                    isOpen={isVerificationDialogOpen}
                    isSending={isResendingVerification}
                    onCodeChange={handleVerificationCodeChange}
                    onConfirm={handleConfirmVerification}
                    onOpenChange={setIsVerificationDialogOpen}
                    onResend={handleResendVerification}
                />
            ) : null}
        </>
    );
}
