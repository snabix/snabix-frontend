import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Введите корректный email.").min(1, "Укажите email."),
  password: z.string().min(1, "Введите пароль."),
});

export const signUpSchema = z
  .object({
    email: z.email("Введите корректный email.").min(1, "Укажите email."),
    password: z.string().min(8, "Минимум 8 символов."),
    passwordConfirmation: z.string().min(1, "Повторите пароль."),
    acceptedTerms: z.boolean(),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    message: "Пароли не совпадают.",
    path: ["passwordConfirmation"],
  })
  .refine((values) => values.acceptedTerms, {
    message: "Нужно принять условия платформы.",
    path: ["acceptedTerms"],
  });

export const forgotPasswordSchema = z.object({
  email: z.email("Введите корректный email.").min(1, "Укажите email."),
});

export const resetPasswordSchema = z
  .object({
    email: z.email("Введите корректный email.").min(1, "Укажите email."),
    password: z.string().min(8, "Минимум 8 символов."),
    passwordConfirmation: z.string().min(1, "Повторите пароль."),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    message: "Пароли не совпадают.",
    path: ["passwordConfirmation"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Введите текущий пароль."),
    password: z.string().min(8, "Минимум 8 символов."),
    passwordConfirmation: z.string().min(1, "Повторите новый пароль."),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    message: "Пароли не совпадают.",
    path: ["passwordConfirmation"],
  });
