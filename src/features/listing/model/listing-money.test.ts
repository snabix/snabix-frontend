import { describe, expect, it } from "vitest";
import {
  isValidIntegerMoney,
  normalizeIntegerMoneyInput,
  parseIntegerMoney,
} from "@/src/features/listing/model/listing-money";

describe("listing money parser", () => {
  it("parses integer money without minor units", () => {
    expect(parseIntegerMoney("12500")).toBe(12500);
    expect(parseIntegerMoney("12 500")).toBe(12500);
  });

  it("treats empty value as nullable price", () => {
    expect(parseIntegerMoney("")).toBeNull();
    expect(isValidIntegerMoney("")).toBe(true);
  });

  it("rejects decimals and non-numeric values", () => {
    expect(parseIntegerMoney("12.50")).toBeNull();
    expect(parseIntegerMoney("12,50")).toBeNull();
    expect(parseIntegerMoney("дорого")).toBeNull();
    expect(isValidIntegerMoney("12.50")).toBe(false);
  });

  it("normalizes spaces only", () => {
    expect(normalizeIntegerMoneyInput(" 12 500 ")).toBe("12500");
  });
});

