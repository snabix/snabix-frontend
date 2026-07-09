import { z } from "zod";

export const profileFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Минимум 2 символа.")
    .max(100, "Максимум 100 символов."),
  lastName: z
    .string()
    .trim()
    .min(2, "Минимум 2 символа.")
    .max(100, "Максимум 100 символов."),
  aboutMe: z
    .string()
    .trim()
    .max(1000, "Максимум 1000 символов.")
    .or(z.literal("")),
});

export const profileContactFormSchema = z.object({
  email: z.email("Введите корректный email.").min(1, "Укажите email."),
  phoneNumber: z
    .string()
    .max(25, "Максимум 25 символов.")
    .optional()
    .or(z.literal("")),
});
