import { describe, expect, it } from "vitest";
import {
  formatPhoneInputValue,
  formatPhoneNumber,
} from "@/src/shared/lib/format-phone-number";

describe("phone formatting", () => {
  it("formats stored Russian phone numbers for display", () => {
    expect(formatPhoneNumber("+79990090909")).toBe("+7 (999) 009 - 09 - 09");
    expect(formatPhoneNumber("89990090909")).toBe("+7 (999) 009 - 09 - 09");
  });

  it("masks phone input progressively", () => {
    expect(formatPhoneInputValue("89990090909")).toBe("+7 (999) 009 - 09 - 09");
    expect(formatPhoneInputValue("+7 (999")).toBe("+7 (999)");
    expect(formatPhoneInputValue("")).toBe("+7");
  });
});
