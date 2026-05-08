"use client";

import { useEffect, useState } from "react";
import { App, Button, Form, Input } from "antd";
import {
    CheckCircle2,
    MapPin,
    Pencil,
    Save,
    ShieldCheck,
    Star,
    UserRound,
    X,
    XCircle,
} from "lucide-react";
import { getUserFullName, useUserStore } from "@/src/entities/user";
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

function RatingCard({
                        rating = 5,
                        reviewsCount = 0,
                    }: {
    rating?: number | null;
    reviewsCount?: number | null;
}) {
    return (
        <div className="inline-flex items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-3.5 py-3 shadow-sm">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#f88f22,#fbb931)] text-white shadow-[0_10px_22px_rgba(248,143,34,0.24)]">
                <Star aria-hidden="true" fill="currentColor" size={18} />
            </div>

            <div>
                <div className="flex items-end gap-1">
          <span className="text-xl font-black leading-none text-[var(--brand-deep)]">
            {Number(rating ?? 0).toFixed(1)}
          </span>

                    <span className="text-xs font-bold text-[var(--text-muted)]">
            / 5.0
          </span>
                </div>

                <p className="mt-0.5 text-[11px] font-semibold text-[var(--text-muted)]">
                    {reviewsCount ?? 0} отзывов
                </p>
            </div>
        </div>
    );
}

function ReadonlyField({
                           label,
                           value,
                           empty = "Не указано",
                       }: {
    label: string;
    value?: string | null;
    empty?: string;
}) {
    return (
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {label}
            </p>

            <p className="mt-1 text-sm font-bold text-[var(--brand-deep)]">
                {value && value.trim() !== "" ? value : empty}
            </p>
        </div>
    );
}

export function ProfilePage() {
    const [form] = Form.useForm<ProfileFormValues>();
    const { message } = App.useApp();

    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);

    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const userName = getUserFullName(user);
    const isEmailVerified = Boolean(user?.emailVerifiedAt);

    useEffect(() => {
        if (!user) {
            return;
        }

        form.setFieldsValue({
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            email: user.email ?? "",
            phoneNumber: user.phoneNumber ?? "",
            region: "КЧР",
            city: "Черкесск",
        });
    }, [form, user]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (!user) {
            return;
        }

        form.setFieldsValue({
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            email: user.email ?? "",
            phoneNumber: user.phoneNumber ?? "",
            region: "КЧР",
            city: "Черкесск",
        });

        setIsEditing(false);
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
            setIsEditing(false);

            message.success("Профиль обновлен.");
        } catch (error) {
            message.error(extractApiError(error, "Не удалось обновить профиль."));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AccountLayout>
            <div className="grid gap-6">
                <section className="surface-card relative overflow-hidden rounded-[32px] p-6 sm:p-8">
                    <div className="pointer-events-none absolute -right-10 top-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(0,70,67,0.16),transparent_70%)]" />

                    <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex items-start gap-5">
                            <div className="grid size-20 shrink-0 place-items-center rounded-3xl bg-[linear-gradient(135deg,var(--brand),var(--accent))] text-[var(--background)] shadow-[0_18px_38px_rgba(0,70,67,0.18)]">
                                <UserRound aria-hidden="true" size={36} strokeWidth={2.15} />
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
                            {!isEditing ? (
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
                            ) : (
                                <button
                                    className={[
                                        "inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold",
                                        "border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)]",
                                        "text-[var(--brand-deep)] shadow-sm backdrop-blur-xl",
                                        "transition-all duration-200 hover:-translate-y-0.5 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-600",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:ring-offset-2",
                                    ].join(" ")}
                                    onClick={handleCancel}
                                    type="button"
                                >
                                    <X aria-hidden="true" size={16} />
                                    Отменить
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {!isEditing ? (
                    <>
                        <section className="surface-card rounded-[32px] p-6 sm:p-8">
                            <div className="mb-6 flex items-start gap-3">
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
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <ReadonlyField label="Имя" value={user?.firstName} />
                                <ReadonlyField label="Фамилия" value={user?.lastName} />
                                <ReadonlyField label="Email" value={user?.email} />
                                <ReadonlyField label="Телефон" value={user?.phoneNumber} />
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
                                <ReadonlyField label="Регион" value="КЧР" />
                                <ReadonlyField label="Город" value="Черкесск" />
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
                    </>
                ) : (
                    <Form<ProfileFormValues>
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        requiredMark={false}
                        disabled={isSubmitting}
                    >
                        <div className="grid gap-6">
                            <section className="surface-card rounded-[32px] p-6 sm:p-8">
                                <div className="mb-6 flex items-start gap-3">
                                    <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                                        <UserRound aria-hidden="true" size={20} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                                            Персональные данные
                                        </p>

                                        <h2 className="font-heading mt-1 text-2xl font-extrabold text-[var(--brand-deep)]">
                                            Редактирование профиля
                                        </h2>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <Form.Item
                                        label="Имя"
                                        name="firstName"
                                        rules={[
                                            { required: true, message: "Укажите имя." },
                                            { min: 2, message: "Минимум 2 символа." },
                                            { max: 100, message: "Максимум 100 символов." },
                                        ]}
                                    >
                                        <Input className="auth-input" placeholder="Ваше имя" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Фамилия"
                                        name="lastName"
                                        rules={[
                                            { required: true, message: "Укажите фамилию." },
                                            { min: 2, message: "Минимум 2 символа." },
                                            { max: 100, message: "Максимум 100 символов." },
                                        ]}
                                    >
                                        <Input className="auth-input" placeholder="Ваша фамилия" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Email"
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

                                    <Form.Item
                                        label="Телефон"
                                        name="phoneNumber"
                                        rules={[{ max: 20, message: "Максимум 20 символов." }]}
                                    >
                                        <Input
                                            className="auth-input"
                                            placeholder="+7 900 000-00-00"
                                        />
                                    </Form.Item>
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

                                <div className="grid gap-4 md:grid-cols-2">
                                    <Form.Item
                                        label="Регион"
                                        name="region"
                                        rules={[{ max: 100, message: "Максимум 100 символов." }]}
                                    >
                                        <Input className="auth-input" placeholder="КЧР" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Город"
                                        name="city"
                                        rules={[{ max: 100, message: "Максимум 100 символов." }]}
                                    >
                                        <Input className="auth-input" placeholder="Черкесск" />
                                    </Form.Item>
                                </div>

                                <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--accent-soft)] p-5">
                                    <p className="text-sm font-bold text-[var(--brand-deep)]">
                                        Подсказка
                                    </p>

                                    <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                                        Эти данные можно использовать для локальной выдачи
                                        объявлений, фильтрации услуг и рекомендаций.
                                    </p>
                                </div>
                            </section>
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
                )}
            </div>
        </AccountLayout>
    );
}