"use client";

import { useEffect, useTransition } from "react";
import { App, Button, Form, Input } from "antd";
import { ShieldCheck, Star, UserRound } from "lucide-react";
import { getUserFullName, useUserStore } from "@/src/entities/user";
import { updateProfile } from "@/src/features/profile/update-profile/api/update-profile";
import { extractApiError } from "@/src/shared/lib/extract-api-error";
import { AccountLayout } from "@/src/widgets/account/ui/account-layout";

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
};

export function ProfilePage() {
  const [form] = Form.useForm<ProfileFormValues>();
  const { message } = App.useApp();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [isPending, startTransition] = useTransition();
  const userName = getUserFullName(user);

  useEffect(() => {
    form.setFieldsValue({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      phoneNumber: user?.phoneNumber ?? "",
    });
  }, [form, user]);

  const handleSubmit = (values: ProfileFormValues) => {
    startTransition(async () => {
      try {
        const updatedUser = await updateProfile({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber?.trim() || null,
        });

        setUser(updatedUser);
        message.success("Профиль обновлен.");
      } catch (error) {
        message.error(extractApiError(error, "Не удалось обновить профиль."));
      }
    });
  };

  return (
    <AccountLayout>
      <div className="grid gap-5">
        <section className="surface-card overflow-hidden rounded-[32px] p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid size-20 place-items-center rounded-[28px] bg-[linear-gradient(135deg,var(--brand),var(--accent))] text-[var(--background)] shadow-[0_18px_38px_rgba(0,70,67,0.18)]">
                <UserRound size={34} />
              </div>
              <div>
                <div className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Личный кабинет
                </div>
                <h1 className="font-heading mt-1 text-3xl font-extrabold text-[var(--brand-deep)]">
                  {userName}
                </h1>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  {user?.email ?? "Данные профиля загрузятся после авторизации."}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_76%,transparent)] p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[var(--brand-deep)]">
                  <Star size={17} className="text-[var(--accent)]" />
                  Рейтинг
                </div>
                <div className="mt-2 text-2xl font-black">5.0</div>
              </div>
              <div className="rounded-3xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_76%,transparent)] p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[var(--brand-deep)]">
                  <ShieldCheck size={17} className="text-[var(--accent)]" />
                  Статус
                </div>
                <div className="mt-2 text-sm font-bold text-[var(--foreground)]">
                  {user?.emailVerifiedAt ? "Email подтвержден" : "Ожидает проверки"}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="surface-card rounded-[32px] p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-extrabold text-[var(--brand-deep)]">
              Данные профиля
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Эти поля соответствуют текущему backend-контракту профиля:
              имя, фамилия, email и телефон.
            </p>
          </div>

          <Form<ProfileFormValues>
            form={form}
            initialValues={{
              firstName: user?.firstName,
              lastName: user?.lastName,
              email: user?.email,
              phoneNumber: user?.phoneNumber ?? "",
            }}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Form.Item
                label="Имя"
                name="firstName"
                rules={[{ required: true, message: "Укажите имя." }]}
              >
                <Input className="auth-input" placeholder="Ваше имя" />
              </Form.Item>

              <Form.Item
                label="Фамилия"
                name="lastName"
                rules={[{ required: true, message: "Укажите фамилию." }]}
              >
                <Input className="auth-input" placeholder="Ваша фамилия" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Укажите email." },
                  { type: "email", message: "Введите корректный email." },
                ]}
              >
                <Input className="auth-input" placeholder="email@example.com" />
              </Form.Item>

              <Form.Item
                label="Телефон"
                name="phoneNumber"
                rules={[{ max: 20, message: "Максимум 20 символов." }]}
              >
                <Input className="auth-input" placeholder="+7 900 000-00-00" />
              </Form.Item>
            </div>

            <Button
              className="auth-primary-button !w-full sm:!w-auto"
              htmlType="submit"
              loading={isPending}
              type="primary"
            >
              Сохранить изменения
            </Button>
          </Form>
        </section>
      </div>
    </AccountLayout>
  );
}
