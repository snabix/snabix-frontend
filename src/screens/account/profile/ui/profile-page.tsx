"use client";

import {
    type ChangeEvent,
    type PointerEvent as ReactPointerEvent,
    type ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";
import { App, Avatar, Button, Form, Input, Modal, Slider } from "antd";
import {
    Camera,
    CheckCircle2,
    MapPin,
    Pencil,
    Save,
    ShieldCheck,
    UserRound,
    X,
    XCircle,
} from "lucide-react";
import { useUserStore } from "@/src/entities/user";
import { uploadProfileAvatar } from "@/src/features/profile/avatar/api/profile-avatar";
import { updateProfile } from "@/src/features/profile/update-profile/api/update-profile";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { AccountLayout } from "@/src/widgets/account/ui/account-layout";

type ProfileFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    region?: string | null;
    city?: string | null;
};

type AvatarDraft = {
    file: File;
    previewUrl: string;
};

type AvatarOffset = {
    x: number;
    y: number;
};

const AVATAR_CANVAS_SIZE = 512;
const AVATAR_EDITOR_SIZE = 360;
const AVATAR_MAX_OFFSET = 128;

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

async function createImageElement(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Не удалось открыть изображение."));
        image.src = src;
    });
}

async function createEditedAvatarFile(
    draft: AvatarDraft,
    scale: number,
    offset: AvatarOffset,
): Promise<File> {
    if (draft.file.type === "image/svg+xml") {
        return draft.file;
    }

    const image = await createImageElement(draft.previewUrl);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Не удалось подготовить изображение.");
    }

    canvas.width = AVATAR_CANVAS_SIZE;
    canvas.height = AVATAR_CANVAS_SIZE;

    const baseScale = Math.max(
        AVATAR_CANVAS_SIZE / image.width,
        AVATAR_CANVAS_SIZE / image.height,
    );
    const targetScale = baseScale * scale;
    const width = image.width * targetScale;
    const height = image.height * targetScale;
    const offsetRatio = AVATAR_CANVAS_SIZE / AVATAR_EDITOR_SIZE;
    const x = (AVATAR_CANVAS_SIZE - width) / 2 + offset.x * offsetRatio;
    const y = (AVATAR_CANVAS_SIZE - height) / 2 + offset.y * offsetRatio;

    context.drawImage(image, x, y, width, height);

    const type = draft.file.type === "image/png" ? "image/png" : "image/jpeg";
    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (result) => {
                if (!result) {
                    reject(new Error("Не удалось сохранить изображение."));
                    return;
                }

                resolve(result);
            },
            type,
            0.92,
        );
    });

    return new File([blob], draft.file.name, {
        lastModified: Date.now(),
        type,
    });
}

function EmailVerificationBadge({ verified }: { verified: boolean }) {
    return (
        <div
            className={[
                "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold",
                verified
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-red-500/10 text-red-600",
            ].join(" ")}
        >
            {verified ? (
                <CheckCircle2 aria-hidden="true" size={15} />
            ) : (
                <XCircle aria-hidden="true" size={15} />
            )}

            {verified ? "Email подтвержден" : "Email не подтвержден"}
        </div>
    );
}

function ProfileDataField({
                              children,
                              label,
                              value,
                              empty = "Не указано",
                          }: {
    children?: ReactNode;
    label: string;
    value?: string | null;
    empty?: string;
}) {
    return (
        <div className="grid gap-2">
            <p className="pl-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {label}
            </p>

            <div className="profile-data-field rounded-2xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-4 py-3 shadow-sm">
                {children ?? (
                    <p className="flex min-h-[46px] items-center text-sm font-bold text-[var(--brand-deep)]">
                        {value && value.trim() !== "" ? value : empty}
                    </p>
                )}
            </div>
        </div>
    );
}

function ProfileSectionHeader() {
    return (
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <UserRound aria-hidden="true" size={20} />
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                        Персональные данные
                    </p>

                    <h2 className="font-heading mt-1 text-2xl font-extrabold text-[var(--brand-deep)]">
                        Основная информация
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                        Данные аккаунта, которые помогают нам подтверждать профиль и держать связь.
                    </p>
                </div>
            </div>
        </div>
    );
}

export function ProfilePage() {
    const { message } = App.useApp();
    const avatarInputRef = useRef<HTMLInputElement | null>(null);

    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAvatarSubmitting, setIsAvatarSubmitting] = useState(false);
    const [isAvatarViewerOpen, setIsAvatarViewerOpen] = useState(false);
    const [avatarDraft, setAvatarDraft] = useState<AvatarDraft | null>(null);
    const [avatarScale, setAvatarScale] = useState(1);
    const [avatarOffset, setAvatarOffset] = useState<AvatarOffset>({ x: 0, y: 0 });

    const isEmailVerified = Boolean(user?.emailVerifiedAt);
    const profileInitialValues: ProfileFormValues = {
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        email: user?.email ?? "",
        phoneNumber: user?.phoneNumber ?? "",
        region: "КЧР",
        city: "Черкесск",
    };

    useEffect(() => {
        return () => {
            if (avatarDraft?.previewUrl) {
                URL.revokeObjectURL(avatarDraft.previewUrl);
            }
        };
    }, [avatarDraft]);

    const handleEdit = () => {
        setIsProfileModalOpen(true);
    };

    const handleCancel = () => {
        setIsProfileModalOpen(false);
    };

    const handleSubmit = async (values: ProfileFormValues) => {
        setIsSubmitting(true);

        try {
            const updatedUser = await updateProfile({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phoneNumber: values.phoneNumber?.trim() || null,
            });

            setUser(updatedUser);
            setIsProfileModalOpen(false);

            message.success("Профиль обновлен.");
        } catch (error) {
            message.error(extractApiError(error, "Не удалось обновить профиль."));
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
            message.error("Размер аватара не должен превышать 3 МБ.");
            return;
        }

        if (!file.type.startsWith("image/")) {
            message.error("Для аватара можно загрузить только изображение.");
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
            message.success("Аватар обновлен.");
        } catch (error) {
            message.error(extractApiError(error, "Не удалось обновить аватар."));
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
                x: clamp(startOffset.x + moveEvent.clientX - startX, -AVATAR_MAX_OFFSET, AVATAR_MAX_OFFSET),
                y: clamp(startOffset.y + moveEvent.clientY - startY, -AVATAR_MAX_OFFSET, AVATAR_MAX_OFFSET),
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

    return (
        <AccountLayout>
            <div className="grid gap-6">
                <section className="surface-card relative overflow-hidden rounded-[32px] p-6 sm:p-8">
                    <div className="pointer-events-none absolute -right-10 top-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(0,70,67,0.16),transparent_70%)]" />

                    <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex items-start gap-5">
                            <div className="relative shrink-0">
                                <button
                                    aria-label="Открыть аватар профиля"
                                    className={[
                                        "relative grid size-20 place-items-center rounded-full",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2",
                                    ].join(" ")}
                                    disabled={isAvatarSubmitting}
                                    onClick={() => setIsAvatarViewerOpen(true)}
                                    type="button"
                                >
                                    <Avatar
                                        className="!grid !size-20 !place-items-center !rounded-full !bg-[linear-gradient(135deg,var(--brand),var(--accent))] !text-[var(--background)] shadow-[0_18px_38px_rgba(0,70,67,0.18)]"
                                        src={user?.avatar?.url ?? undefined}
                                    >
                                        <UserRound
                                            aria-hidden="true"
                                            size={36}
                                            strokeWidth={2.15}
                                        />
                                    </Avatar>
                                </button>

                                <button
                                    aria-label="Загрузить новый аватар"
                                    className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full border-2 border-[var(--surface)] bg-[#2AABEE] text-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2AABEE] focus-visible:ring-offset-2"
                                    disabled={isAvatarSubmitting}
                                    onClick={handleAvatarSelect}
                                    type="button"
                                >
                                    <Camera aria-hidden="true" size={14} />
                                </button>

                                <input
                                    ref={avatarInputRef}
                                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                    type="file"
                                />
                            </div>

                            <div>
                                <div className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                                    Личный кабинет
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    <EmailVerificationBadge verified={isEmailVerified} />

                                    <div
                                        className={[
                                            "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold",
                                            user?.isActive
                                                ? "bg-emerald-500/10 text-emerald-600"
                                                : "bg-red-500/10 text-red-600",
                                        ].join(" ")}
                                    >
                                        <ShieldCheck aria-hidden="true" size={15} />
                                        {user?.isActive ? "Аккаунт активен" : "Аккаунт отключен"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center xl:justify-end">
                            <button
                                className={[
                                    "inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold",
                                    "border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)]",
                                    "text-[var(--brand-deep)] shadow-sm backdrop-blur-xl",
                                    "transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2",
                                ].join(" ")}
                                onClick={handleEdit}
                                type="button"
                            >
                                <Pencil aria-hidden="true" size={16} />
                            </button>
                        </div>
                    </div>
                </section>

                <section className="surface-card rounded-[32px] p-6 sm:p-8">
                    <ProfileSectionHeader />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <ProfileDataField label="Имя" value={user?.firstName} />
                        <ProfileDataField label="Фамилия" value={user?.lastName} />
                        <ProfileDataField label="Email" value={user?.email} />
                        <ProfileDataField label="Телефон" value={user?.phoneNumber} />
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
                        <ProfileDataField label="Регион" value="КЧР" />
                        <ProfileDataField label="Город" value="Черкесск" />
                    </div>

                    <div className="mt-5 rounded-3xl border border-[var(--border-soft)] bg-[var(--accent-soft)] p-5">
                        <p className="text-sm font-bold text-[var(--brand-deep)]">
                            Почему это важно
                        </p>

                        <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                            Регион и город помогут точнее показывать объявления, услуги и
                            предложения рядом с пользователем.
                        </p>
                    </div>
                </section>
            </div>

            {isAvatarViewerOpen ? (
                <div
                    className="fixed inset-0 z-50 grid bg-[#02060e]/92 px-4 py-5 text-white backdrop-blur-md sm:px-6"
                    onClick={handleAvatarViewerClose}
                >
                    <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6">
                        <button
                            aria-label="Закрыть просмотр аватара"
                            className="grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                            onClick={handleAvatarViewerClose}
                            type="button"
                        >
                            <X aria-hidden="true" size={22} />
                        </button>
                    </div>

                    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center gap-6 pt-14">
                        <div
                            className={[
                                "relative flex min-h-[300px] w-full items-center justify-center p-4 sm:min-h-[520px] sm:p-8",
                                avatarDraft
                                    ? "rounded-[34px] bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                                    : "",
                            ].join(" ")}
                            onClick={(event) => event.stopPropagation()}
                        >
                            {avatarDraft ? (
                                <div className="relative grid size-[min(78vw,440px)] place-items-center overflow-hidden rounded-[34px] bg-[#111827] shadow-[0_24px_80px_rgba(0,0,0,0.36)]">
                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0_58%,rgba(0,0,0,0.56)_58.3%_100%)]" />

                                    <div
                                        className="relative grid size-[min(70vw,360px)] cursor-grab touch-none place-items-center overflow-hidden rounded-full bg-black active:cursor-grabbing"
                                        onPointerDown={handleAvatarMovePointerDown}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            alt="Предпросмотр нового аватара"
                                            className="pointer-events-none h-full w-full select-none object-cover"
                                            src={avatarDraft.previewUrl}
                                            style={{
                                                transform: `translate(${avatarOffset.x}px, ${avatarOffset.y}px) scale(${avatarScale})`,
                                            }}
                                        />

                                        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full ring-2 ring-white/95">
                                            <span className="absolute bottom-0 left-1/3 top-0 w-px bg-white/60" />
                                            <span className="absolute bottom-0 left-2/3 top-0 w-px bg-white/60" />
                                            <span className="absolute left-0 right-0 top-1/3 h-px bg-white/60" />
                                            <span className="absolute left-0 right-0 top-2/3 h-px bg-white/60" />
                                        </div>
                                    </div>
                                </div>
                            ) : user?.avatar?.url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    alt="Аватар пользователя"
                                    className="max-h-[86vh] max-w-[94vw] object-contain"
                                    src={user.avatar.url}
                                />
                            ) : (
                                <button
                                    className="grid size-[min(72vw,300px)] place-items-center rounded-full bg-[linear-gradient(135deg,var(--brand),#2AABEE)] text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                                    onClick={handleAvatarSelect}
                                    type="button"
                                >
                                    <Camera aria-hidden="true" size={68} />
                                </button>
                            )}
                        </div>

                        {avatarDraft ? (
                            <div
                                className="w-full max-w-xl rounded-[30px] bg-white/[0.08] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)]"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-black">Редактирование аватара</p>
                                        <p className="mt-1 text-xs text-white/62">
                                            Двигайте фото внутри круга и меняйте приближение.
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/72">
                                        {Math.round(avatarScale * 100)}%
                                    </span>
                                </div>

                                <Slider
                                    className="mt-5"
                                    max={2.4}
                                    min={1}
                                    onChange={setAvatarScale}
                                    step={0.01}
                                    tooltip={{ formatter: null }}
                                    value={avatarScale}
                                />

                                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <button
                                        className="h-11 rounded-full bg-white/10 px-5 text-sm font-bold text-white transition-colors hover:bg-white/16"
                                        disabled={isAvatarSubmitting}
                                        onClick={() => {
                                            setAvatarDraft(null);
                                            setAvatarScale(1);
                                            setAvatarOffset({ x: 0, y: 0 });
                                        }}
                                        type="button"
                                    >
                                        Отмена
                                    </button>

                                    <button
                                        className="h-11 rounded-full bg-[#2AABEE] px-5 text-sm font-black text-white shadow-[0_14px_34px_rgba(42,171,238,0.28)] transition-colors hover:bg-[#229ED9] disabled:cursor-not-allowed disabled:opacity-60"
                                        disabled={isAvatarSubmitting}
                                        onClick={handleAvatarSave}
                                        type="button"
                                    >
                                        {isAvatarSubmitting ? "Сохраняем..." : "Сохранить аватар"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            null
                        )}
                    </div>
                </div>
            ) : null}

            <Modal
                centered
                destroyOnHidden
                footer={null}
                onCancel={handleCancel}
                open={isProfileModalOpen}
                title={null}
                width={720}
            >
                <div className="pt-2">
                    <div className="mb-6 flex items-start gap-3">
                        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                            <Pencil aria-hidden="true" size={20} />
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                                Редактирование профиля
                            </p>

                            <h2 className="font-heading mt-1 text-2xl font-extrabold text-[var(--brand-deep)]">
                                Обновить данные
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                                Измените только нужные поля. После смены email потребуется повторное подтверждение.
                            </p>
                        </div>
                    </div>

                    <Form<ProfileFormValues>
                        disabled={isSubmitting}
                        initialValues={profileInitialValues}
                        layout="vertical"
                        onFinish={handleSubmit}
                        requiredMark={false}
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <ProfileDataField label="Имя">
                                <Form.Item
                                    className="profile-form-item"
                                    name="firstName"
                                    rules={[
                                        { required: true, message: "Укажите имя." },
                                        { min: 2, message: "Минимум 2 символа." },
                                        { max: 100, message: "Максимум 100 символов." },
                                    ]}
                                >
                                    <Input className="auth-input" placeholder="Ваше имя" />
                                </Form.Item>
                            </ProfileDataField>

                            <ProfileDataField label="Фамилия">
                                <Form.Item
                                    className="profile-form-item"
                                    name="lastName"
                                    rules={[
                                        { required: true, message: "Укажите фамилию." },
                                        { min: 2, message: "Минимум 2 символа." },
                                        { max: 100, message: "Максимум 100 символов." },
                                    ]}
                                >
                                    <Input className="auth-input" placeholder="Ваша фамилия" />
                                </Form.Item>
                            </ProfileDataField>

                            <ProfileDataField label="Email">
                                <Form.Item
                                    className="profile-form-item"
                                    name="email"
                                    normalize={(value: string) => value?.trim()}
                                    rules={[
                                        { required: true, message: "Укажите email." },
                                        { type: "email", message: "Введите корректный email." },
                                    ]}
                                >
                                    <Input
                                        className="auth-input"
                                        placeholder="email@example.com"
                                    />
                                </Form.Item>
                            </ProfileDataField>

                            <ProfileDataField label="Телефон">
                                <Form.Item
                                    className="profile-form-item"
                                    name="phoneNumber"
                                    rules={[{ max: 20, message: "Максимум 20 символов." }]}
                                >
                                    <Input
                                        className="auth-input"
                                        placeholder="+7 900 000-00-00"
                                    />
                                </Form.Item>
                            </ProfileDataField>
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Button onClick={handleCancel} disabled={isSubmitting}>
                                Отменить
                            </Button>

                            <Button
                                className="auth-primary-button"
                                htmlType="submit"
                                icon={<Save size={17} />}
                                loading={isSubmitting}
                                type="primary"
                            >
                                Сохранить изменения
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </AccountLayout>
    );
}
