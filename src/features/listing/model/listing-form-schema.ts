import { z } from "zod";
import { isValidIntegerMoney } from "@/src/features/listing/model/listing-money";

export const listingFormSchema = z.object({
  title: z.string().trim().min(1, "Укажите заголовок объявления."),
  description: z.string().trim().min(1, "Опишите объявление."),
  price: z
    .string()
    .trim()
    .refine(isValidIntegerMoney, {
      message: "Цена должна быть целым числом без копеек.",
    }),
  currency: z
    .string()
    .trim()
    .refine((value) => value === "" || /^[A-Za-z]{3}$/.test(value), {
      message: "Валюта должна состоять из 3 латинских букв.",
    }),
});

export type ListingFormValues = z.infer<typeof listingFormSchema>;
