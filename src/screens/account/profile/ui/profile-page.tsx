"use client";

import {
    CalendarDays,
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
import { ShareProfileButton } from "@/src/shared/ui/share-profile-button";
import { useEmailVerification } from "@/src/screens/account/profile/model/use-email-verification";
import {
    EmailVerificationBadge,
    ProfileDataField,
    ProfileSectionHeader,
    ProfileStatusPill,
} from "@/src/screens/account/profile/ui/profile-parts";
import { EmailVerificationDialog } from "@/src/screens/account/profile/ui/email-verification-dialog";
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
    return (
        <>
            <div className="grid gap-6">
                <section className="surface-card relative overflow-hidden rounded-[34px] p-6 sm:p-8">
                    <div className="pointer-events-none absolute -right-12 -top-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--brand)_22%,transparent),transparent_72%)]" />
                    <div className="pointer-events-none absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--foreground)_12%,transparent),transparent_72%)]" />

                    <div className="relative flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex items-start gap-5">
                            <div className="relative shrink-0">
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
                            </div>

                            <div className="max-w-2xl">
                                <div className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                                    Личный кабинет
                                </div>

                                <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--text-muted)]">
                                    Просматривайте контакты, статус аккаунта и базовую информацию профиля.
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

                        <ShareProfileButton
                            path={user?.id ? `/sellers/${user.id}` : "/account/profile"}
                            text="Профиль пользователя Snabix"
                            title={resolveProfileShareTitle(user?.firstName, user?.lastName)}
                        />
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
                            icon={CalendarDays}
                            label="Дата рождения"
                            value={formatProfileDate(user?.dateOfBirth)}
                        />
                        <ProfileDataField
                            className="sm:col-span-2"
                            icon={FileText}
                            label="О себе"
                            value={user?.description}
                        />
                    </div>
                </section>

                <ProfileAddressesSection mode="view" />
            </div>

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

function resolveProfileShareTitle(firstName?: string | null, lastName?: string | null): string {
    const label = [firstName, lastName]
        .map((part) => part?.trim())
        .filter(Boolean)
        .join(" ");

    return label !== "" ? `${label} на Snabix` : "Профиль на Snabix";
}

function formatProfileDate(value?: string | null): string {
    if (!value) {
        return "";
    }

    const [year, month, day] = value.split("-");

    if (!year || !month || !day) {
        return value;
    }

    return `${day}.${month}.${year}`;
}
