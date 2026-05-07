"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { getMe, useUserStore } from "@/src/entities/user";
import { signUp } from "@/src/features/auth/api";
import { SignUpFormValues } from "@/src/features/auth/lib/auth-form-values";
import { extractAccessToken, saveAccessToken } from "@/src/shared/lib/access-token";
import { extractApiError } from "@/src/shared/lib/extract-api-error";

export function SignUpForm() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (values: SignUpFormValues) => {
    try {
      const response = await signUp({
        name: values.name,
        email: values.email,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
      });
      const token = extractAccessToken(response);

      if (token) {
        saveAccessToken(token);
      }

      const user = await getMe();
      setUser(user);
      message.success("Аккаунт создан. Проверьте почту для подтверждения.");
      startTransition(() => {
        router.push("/");
        router.refresh();
      });
    } catch (error) {
      message.error(extractApiError(error, "Не удалось создать аккаунт."));
    }
  };

  return (
    <div className="auth-card">
      <h1 className="font-heading text-2xl font-extrabold text-[var(--brand-deep)]">
        Регистрация
      </h1>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        После создания аккаунта мы отправим письмо для подтверждения почты.
      </p>

      <Form<SignUpFormValues>
        autoComplete="off"
        className="mt-7"
        initialValues={{ acceptedTerms: true }}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item
          label="Имя"
          name="name"
          rules={[{ required: true, message: "Укажите ваше имя." }]}
        >
          <Input className="auth-input" placeholder="Иван Петров" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Укажите email." },
            { type: "email", message: "Введите корректный email." },
          ]}
        >
          <Input className="auth-input" placeholder="team@company.ru" />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            { required: true, message: "Введите пароль." },
            { min: 8, message: "Минимум 8 символов." },
          ]}
        >
          <Input.Password
            className="auth-input"
            placeholder="Не менее 8 символов"
          />
        </Form.Item>

        <Form.Item
          dependencies={["password"]}
          label="Повторите пароль"
          name="passwordConfirmation"
          rules={[
            { required: true, message: "Повторите пароль." },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error("Пароли не совпадают."));
              },
            }),
          ]}
        >
          <Input.Password
            className="auth-input"
            placeholder="Повторите пароль"
          />
        </Form.Item>

        <Form.Item
          className="mb-4"
          name="acceptedTerms"
          rules={[
            {
              validator(_, value) {
                if (value) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error("Нужно принять условия платформы."),
                );
              },
            },
          ]}
          valuePropName="checked"
        >
          <Checkbox className="text-[var(--text-muted)]">
            Я принимаю условия платформы
          </Checkbox>
        </Form.Item>

        <Button
          block
          className="auth-primary-button"
          htmlType="submit"
          loading={isPending}
          type="primary"
        >
          Создать аккаунт
        </Button>
      </Form>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Уже есть аккаунт?{" "}
        <Link className="font-semibold text-[var(--accent)]" href="/sign-in">
          Войти
        </Link>
      </p>
    </div>
  );
}
