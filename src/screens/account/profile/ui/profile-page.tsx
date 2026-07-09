"use client";

import {
    Camera,
    ChevronRight,
    FileText,
    Mail,
    Phone,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { useUserStore } from "@/src/entities/user";
import { formatPhoneNumber } from "@/src/shared/lib/format-phone-number";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/ui/shadcn/avatar";
import { useAvatarEditor } from "@/src/screens/account/profile/model/use-avatar-editor";
import { useEmailVerification } from "@/src/screens/account/profile/model/use-email-verification";
import {
    EmailVerificationBadge,
    ProfileDataField,
    ProfileSectionHeader,
    ProfileStatusPill,
} from "@/src/screens/account/profile/ui/profile-parts";
import { EmailVerificationDialog } from "@/src/screens/account/profile/ui/email-verification-dialog";
import { ProfileAvatarViewer } from "@/src/screens/account/profile/ui/profile-avatar-viewer";
import { ProfileAddressesSection } from "@/src/screens/account/profile/ui/profile-addresses-section";

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
        resendCooldownSeconds,
        setIsVerificationDialogOpen,
        verificationCode,
    } = useEmailVerification();
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
            <div className="grid gap-6">
                <section className="surface-card relative overflow-hidden rounded-[34px] p-6 sm:p-8">
                    <div className="pointer-events-none absolute -right-12 -top-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--brand)_22%,transparent),transparent_72%)]" />
                    <div className="pointer-events-none absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--foreground)_12%,transparent),transparent_72%)]" />

                    <div className="relative flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex items-start gap-5">
                            <div className="relative shrink-0">
                                <button
                                    aria-label="Загрузить новый аватар"
                                    className={[
                                        "relative grid size-24 place-items-center rounded-full",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2",
                                    ].join(" ")}
                                    disabled={isAvatarSubmitting}
                                    onClick={handleAvatarSelect}
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
                            value={formatPhoneNumber(user?.phoneNumber)}
                        />
                        <ProfileDataField
                            className="sm:col-span-2"
                            icon={FileText}
                            label="О себе"
                            value={user?.aboutMe}
                        />
                    </div>
                </section>

                <ProfileAddressesSection mode="view" />
            </div>

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

            {user?.email && !isEmailVerified ? (
                <EmailVerificationDialog
                    code={verificationCode}
                    cooldownSeconds={resendCooldownSeconds}
                    email={user.email}
                    isConfirming={isConfirmingVerification}
                    isOpen={isVerificationDialogOpen}
                    isSending={isResendingVerification}
                    onCodeChangeAction={handleVerificationCodeChange}
                    onConfirmAction={handleConfirmVerification}
                    onOpenChangeAction={setIsVerificationDialogOpen}
                    onResendAction={handleResendVerification}
                />
            ) : null}
        </>
    );
}
