"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { App, Button, Form, Input } from "antd";
import { getMe, useUserStore } from "@/src/entities/user";
import { signIn } from "@/src/features/auth/api";
import { SignInFormValues } from "@/src/features/auth/lib/auth-form-values";
import {
  extractAccessToken,
  saveAccessToken,
} from "@/src/shared/lib/access-token";
import { extractApiError } from "@/src/shared/lib/extract-api-error";

export function SignInForm() {
  const router = useRouter();
  const { message } = App.useApp();
  const setUser = useUserStore((state) => state.setUser);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (values: SignInFormValues) => {
    try {
      const response = await signIn(values);
      const token = extractAccessToken(response);

      if (token) {
        saveAccessToken(token);
      }

      const user = await getMe();
      setUser(user);
      message.success("Вы вошли в аккаунт.");
      startTransition(() => {
        router.push(resolveRedirectPath(getRedirectParam()));
        router.refresh();
      });
    } catch (error) {
      message.error(extractApiError(error, "Не удалось выполнить вход."));
    }
  };

  return (
    <div className="auth-card">
      <h1 className="font-heading text-2xl font-extrabold text-[var(--brand-deep)]">
        Вход
      </h1>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        Введите данные, чтобы продолжить работу.
      </p>

      <Form<SignInFormValues>
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

        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-sm text-[var(--brand-deep)]">Пароль</span>
          <Link
            className="text-sm font-semibold text-[var(--accent)]"
            href="/forgot-password"
          >
            Забыли пароль?
          </Link>
        </div>

        <Form.Item
          className="auth-form-item-without-label"
          name="password"
          rules={[{ required: true, message: "Введите пароль." }]}
        >
          <Input.Password className="auth-input" placeholder="Введите пароль" />
        </Form.Item>

        <Button
          block
          className="auth-primary-button mt-1"
          htmlType="submit"
          loading={isPending}
          type="primary"
        >
          Войти
        </Button>
      </Form>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Нет аккаунта на платформе?{" "}
        <Link className="font-semibold text-[var(--accent)]" href="/sign-up">
          Создай его сейчас!
        </Link>
      </p>
    </div>
  );
}

function getRedirectParam(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(window.location.search).get("redirectTo");
}

function resolveRedirectPath(value: string | null): string {
  if (value === null || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}
