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
  email: z.email("Введите корректный email.").min(1, "Укажите email."),
  phoneNumber: z
    .string()
    .max(20, "Максимум 20 символов.")
    .optional()
    .or(z.literal("")),
  region: z.string().optional(),
  city: z.string().optional(),
});
