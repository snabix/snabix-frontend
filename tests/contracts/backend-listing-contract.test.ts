import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  listingItemSchema,
  publicListingItemSchema,
} from "@/src/shared/api/api-schemas";

type ListingContractDefinition = {
  requiredFields: string[];
  example: Record<string, unknown>;
};

type ListingContractSnapshot = {
  contract: string;
  version: number;
  producer: string;
  consumer: string;
  publicListing: ListingContractDefinition & {
    forbiddenFields: string[];
  };
  privateListing: ListingContractDefinition;
};

const snapshot = readSnapshot();

describe("backend listing consumer contract", () => {
  it("uses the expected versioned producer and consumer", () => {
    expect(snapshot).toMatchObject({
      consumer: "snabix-frontend",
      contract: "snabix.listings",
      producer: "snabix-backend",
      version: 1,
    });
  });

  it("keeps complete examples for every required backend field", () => {
    assertRequiredExampleFields(snapshot.publicListing);
    assertRequiredExampleFields(snapshot.privateListing);
  });

  it("parses backend public and private examples through domain adapters", () => {
    expect(publicListingItemSchema.safeParse(
      snapshot.publicListing.example,
    ).success).toBe(true);
    expect(listingItemSchema.safeParse(
      snapshot.privateListing.example,
    ).success).toBe(true);
  });

  it.each(snapshot.publicListing.forbiddenFields)(
    "rejects private field %s at the public listing boundary",
    (field) => {
      const leakedPayload = {
        ...snapshot.publicListing.example,
        [field]: snapshot.privateListing.example[field],
      };

      expect(publicListingItemSchema.safeParse(leakedPayload).success).toBe(false);
    },
  );
});

function readSnapshot(): ListingContractSnapshot {
  const path = resolve(process.cwd(), "contracts/listings.v1.json");

  return JSON.parse(readFileSync(path, "utf8")) as ListingContractSnapshot;
}

function assertRequiredExampleFields(
  definition: ListingContractDefinition,
): void {
  for (const field of definition.requiredFields) {
    expect(definition.example).toHaveProperty(field);
  }
}
