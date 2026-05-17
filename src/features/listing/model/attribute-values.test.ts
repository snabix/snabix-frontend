import { describe, expect, it } from "vitest";
import { parseAttributeNumber } from "@/src/features/listing/model/attribute-values";

describe("attribute values helpers", () => {
  it("parses numeric category attributes safely", () => {
    expect(parseAttributeNumber("12")).toBe(12);
    expect(parseAttributeNumber("12.5")).toBe(12.5);
    expect(parseAttributeNumber("12,5")).toBe(12.5);
  });

  it("returns null for empty or invalid category number", () => {
    expect(parseAttributeNumber("")).toBeNull();
    expect(parseAttributeNumber("abc")).toBeNull();
  });
});

