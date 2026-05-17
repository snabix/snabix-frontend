"use client";

import {
    type ChangeEvent,
    type PointerEvent as ReactPointerEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Camera,
    ChevronRight,
    Mail,
    MapPin,
    Pencil,
    Phone,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/src/entities/user";
import { resendEmailVerification, verifyEmailCode } from "@/src/features/auth/api";
import { uploadProfileAvatar } from "@/src/features/profile/avatar/api";
import {
    AVATAR_MAX_OFFSET,
    type AvatarDraft,
    type AvatarOffset,
    clampAvatarOffset,
    createEditedAvatarFile,
} from "@/src/features/profile/avatar/lib/avatar-editor";
import { profileFormSchema } from "@/src/features/profile/update-profile/model/profile-form-schema";
import { updateProfile } from "@/src/features/profile/update-profile/api";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/ui/shadcn/avatar";
import { Button } from "@/src/shared/ui/shadcn/button";
import { AccountLayout } from "@/src/widgets/account/ui/account-layout";
import {
    EmailVerificationBadge,
    ProfileDataField,
    ProfileSectionHeader,
    ProfileStatusPill,
} from "@/src/screens/account/profile/ui/profile-parts";
import { EmailVerificationDialog } from "@/src/screens/account/profile/ui/email-verification-dialog";
import { ProfileAvatarViewer } from "@/src/screens/account/profile/ui/profile-avatar-viewer";
import { ProfileEditDialog } from "@/src/screens/account/profile/ui/profile-edit-dialog";
import type { ProfileFormValues } from "@/src/screens/account/profile/ui/profile-types";

export function ProfilePage() {
    const avatarInputRef = useRef<HTMLInputElement | null>(null);

    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAvatarSubmitting, setIsAvatarSubmitting] = useState(false);
    const [isAvatarViewerOpen, setIsAvatarViewerOpen] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [isConfirmingVerification, setIsConfirmingVerification] = useState(false);
    const [isResendingVerification, setIsResendingVerification] = useState(false);
    const [resendCooldownSeconds, setResendCooldownSeconds] = useState(0);
    const [avatarDraft, setAvatarDraft] = useState<AvatarDraft | null>(null);
    const [avatarScale, setAvatarScale] = useState(1);
    const [avatarOffset, setAvatarOffset] = useState<AvatarOffset>({ x: 0, y: 0 });

    const isEmailVerified = Boolean(user?.emailVerifiedAt);
    const profileInitialValues = useMemo<ProfileFormValues>(() => ({
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        email: user?.email ?? "",
        phoneNumber: user?.phoneNumber ?? "",
        region: "КЧР",
        city: "Черкесск",
    }), [user?.email, user?.firstName, user?.lastName, user?.phoneNumber]);
    const {
        formState: { errors },
        handleSubmit,
        register,
        reset,
    } = useForm<ProfileFormValues>({
        defaultValues: profileInitialValues,
        resolver: zodResolver(profileFormSchema),
    });

    useEffect(() => {
        return () => {
            if (avatarDraft?.previewUrl) {
                URL.revokeObjectURL(avatarDraft.previewUrl);
            }
        };
    }, [avatarDraft]);

    useEffect(() => {
        reset(profileInitialValues);
    }, [profileInitialValues, reset]);

    useEffect(() => {
        if (resendCooldownSeconds <= 0) {
            return;
        }

        const timer = window.setInterval(() => {
            setResendCooldownSeconds((currentValue) => (
                currentValue > 0 ? currentValue - 1 : 0
            ));
        }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, [resendCooldownSeconds]);

    const handleEdit = () => {
        reset(profileInitialValues);
        setIsProfileModalOpen(true);
    };

    const handleCancel = () => {
        setIsProfileModalOpen(false);
    };

    const onSubmit = async (values: ProfileFormValues) => {
        setIsSubmitting(true);

        try {
            const previousEmail = user?.email ?? null;
            const wasEmailVerified = isEmailVerified;
            const updatedUser = await updateProfile({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phoneNumber: values.phoneNumber?.trim() || null,
            });

            setUser(updatedUser);
            setIsProfileModalOpen(false);

            if (
                previousEmail !== null
                && previousEmail !== updatedUser.email
                && wasEmailVerified
                && !updatedUser.emailVerifiedAt
            ) {
                setVerificationCode("");
                setResendCooldownSeconds(60);
                setIsVerificationDialogOpen(true);
                toast.success("Профиль обновлен. Новый email нужно подтвердить повторно.");
            } else {
                toast.success("Профиль обновлен.");
            }
        } catch (error) {
            toast.error(extractApiError(error, "Не удалось обновить профиль."));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAvatarSelect = () => {
        avatarInputRef.current?.click();
    };

    const handleAvatarViewerClose = () => {
        setIsAvatarViewerOpen(false);
        setAvatarDraft(null);
        setAvatarScale(1);
        setAvatarOffset({ x: 0, y: 0 });
    };

    const handleAvatarChange = async (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];

        event.target.value = "";

        if (!file) {
            return;
        }

        if (file.size > 3 * 1024 * 1024) {
            toast.error("Размер аватара не должен превышать 3 МБ.");
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("Для аватара можно загрузить только изображение.");
            return;
        }

        setAvatarDraft({
            file,
            previewUrl: URL.createObjectURL(file),
        });
        setAvatarScale(1);
        setAvatarOffset({ x: 0, y: 0 });
        setIsAvatarViewerOpen(true);
    };

    const handleAvatarSave = async () => {
        if (!avatarDraft) {
            return;
        }

        setIsAvatarSubmitting(true);

        try {
            const avatarFile = await createEditedAvatarFile(
                avatarDraft,
                avatarScale,
                avatarOffset,
            );
            const updatedUser = await uploadProfileAvatar(avatarFile);

            setUser(updatedUser);
            setIsAvatarViewerOpen(false);
            setAvatarDraft(null);
            setAvatarScale(1);
            setAvatarOffset({ x: 0, y: 0 });
            toast.success("Аватар обновлен.");
        } catch (error) {
            toast.error(extractApiError(error, "Не удалось обновить аватар."));
        } finally {
            setIsAvatarSubmitting(false);
        }
    };

    const handleAvatarMovePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        event.preventDefault();

        const startX = event.clientX;
        const startY = event.clientY;
        const startOffset = avatarOffset;

        const handlePointerMove = (moveEvent: PointerEvent) => {
            setAvatarOffset({
                x: clampAvatarOffset(startOffset.x + moveEvent.clientX - startX, -AVATAR_MAX_OFFSET, AVATAR_MAX_OFFSET),
                y: clampAvatarOffset(startOffset.y + moveEvent.clientY - startY, -AVATAR_MAX_OFFSET, AVATAR_MAX_OFFSET),
            });
        };

        const handlePointerUp = () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
            document.body.style.userSelect = "";
        };

        document.body.style.userSelect = "none";
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
    };

    const handleAvatarDraftReset = () => {
        setAvatarDraft(null);
        setAvatarScale(1);
        setAvatarOffset({ x: 0, y: 0 });
    };

    const handleResendVerification = async () => {
        setIsResendingVerification(true);

        try {
            const result = await resendEmailVerification();

            setResendCooldownSeconds(result.cooldownSeconds);

            if (result.sent) {
                setVerificationCode("");
                toast.success(result.message);
            } else {
                toast.message(result.message);
            }
        } catch (error) {
            toast.error(extractApiError(error, "Не удалось отправить письмо повторно."));
        } finally {
            setIsResendingVerification(false);
        }
    };

    const handleVerificationCodeChange = (value: string) => {
        setVerificationCode(value.replace(/\D/g, "").slice(0, 6));
    };

    const handleConfirmVerification = async () => {
        if (verificationCode.length !== 6) {
            return;
        }

        setIsConfirmingVerification(true);

        try {
            const result = await verifyEmailCode({
                code: verificationCode,
            });

            if (user) {
                setUser({
                    ...user,
                    emailVerifiedAt: result.verified ? new Date().toISOString() : user.emailVerifiedAt,
                });
            }

            setVerificationCode("");
            setIsVerificationDialogOpen(false);
            toast.success(result.message);
        } catch (error) {
            toast.error(extractApiError(error, "Не удалось подтвердить email."));
        } finally {
            setIsConfirmingVerification(false);
        }
    };

    return (
        <AccountLayout>
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
                            value="КЧР"
                        />
                        <ProfileDataField
                            icon={MapPin}
                            label="Город"
                            value="Черкесск"
                        />
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
                    onAvatarDraftReset={handleAvatarDraftReset}
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
                onSubmit={onSubmit}
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
        </AccountLayout>
    );
}
