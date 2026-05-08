"use client";

import Link from "next/link";
import { useTransition } from "react";
import { App, Button, Form, Input } from "antd";
import { forgotPassword } from "@/src/features/auth/api";
import { ForgotPasswordFormValues } from "@/src/features/auth/lib/auth-form-values";
import { extractApiError } from "@/src/shared/lib/extract-api-error";

export function ForgotPasswordForm() {
  const { message } = App.useApp();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (values: ForgotPasswordFormValues) => {
    startTransition(async () => {
      try {
        await forgotPassword(values);
        message.success("Если аккаунт найден, мы отправим письмо для сброса.");
      } catch (error) {
        message.error(
          extractApiError(error, "Не удалось отправить письмо для сброса."),
        );
      }
    });
  };

  return (
    <div className="auth-card">
      <h1 className="font-heading text-2xl font-extrabold text-[var(--brand-deep)]">
        Сброс пароля
      </h1>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        Укажите email, и мы отправим ссылку для восстановления доступа.
      </p>

      <Form<ForgotPasswordFormValues>
        autoComplete="off"
        className="mt-7"
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Укажите email." },
            { type: "email", message: "Введите корректный email." },
          ]}
        >
          <Input className="auth-input" placeholder="you@example.com" />
        </Form.Item>

        <Button
          block
          className="auth-primary-button"
          htmlType="submit"
          loading={isPending}
          type="primary"
        >
          Отправить письмо
        </Button>
      </Form>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Вспомнили пароль?{" "}
        <Link className="font-semibold text-[var(--accent)]" href="/sign-in">
          Войти
        </Link>
      </p>
    </div>
  );
}
