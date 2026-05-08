"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { App, Button, Checkbox, Form, Input } from "antd";
import { getMe, useUserStore } from "@/src/entities/user";
import { signUp } from "@/src/features/auth/api";
import { SignUpFormValues } from "@/src/features/auth/lib/auth-form-values";
import { extractAccessToken, saveAccessToken } from "@/src/shared/lib/access-token";
import { extractApiError } from "@/src/shared/lib/extract-api-error";

export function SignUpForm() {
  const router = useRouter();
  const { message } = App.useApp();
  const setUser = useUserStore((state) => state.setUser);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (values: SignUpFormValues) => {
    try {
      const response = await signUp({
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
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
      <h1 className="font-heading text-2xl mb-4 font-extrabold text-[var(--brand-deep)]">
        Регистрация
      </h1>

      <Form<SignUpFormValues>
        autoComplete="off"
        className="mt-7"
        initialValues={{ acceptedTerms: true }}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Form.Item
            label="Имя"
            name="firstName"
            rules={[{ required: true, message: "Укажите ваше имя." }]}
          >
            <Input className="auth-input" placeholder="Иван" />
          </Form.Item>

          <Form.Item
            label="Фамилия"
            name="lastName"
            rules={[{ required: true, message: "Укажите вашу фамилию." }]}
          >
            <Input className="auth-input" placeholder="Петров" />
          </Form.Item>
        </div>

        <Form.Item
          label="Телефон"
          name="phoneNumber"
          rules={[
            { required: true, message: "Укажите номер телефона." },
            { max: 20, message: "Максимум 20 символов." },
          ]}
        >
          <Input className="auth-input" placeholder="+7 999 123-45-67" />
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
