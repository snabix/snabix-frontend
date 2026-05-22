import { describe, expect, it } from "vitest";
import { listingFormSchema } from "@/src/features/listing/model/listing-form-schema";

describe("listingFormSchema", () => {
  it("accepts valid listing values", () => {
    const result = listingFormSchema.safeParse({
      title: "Шкаф из массива",
      description: "В хорошем состоянии, самовывоз.",
      price: "12500",
      currency: "RUB",
    });

    expect(result.success).toBe(true);
  });

  it("allows empty optional price and currency values", () => {
    const result = listingFormSchema.safeParse({
      title: "Ремонт стиральных машин",
      description: "Диагностика и ремонт на дому.",
      price: "",
      currency: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid price and currency values", () => {
    const result = listingFormSchema.safeParse({
      title: "Ноутбук",
      description: "Рабочий ноутбук.",
      price: "12.50",
      currency: "RUBLE",
    });

    expect(result.success).toBe(false);
  });
});
