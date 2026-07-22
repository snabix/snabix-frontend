import { z } from "zod";

export const platformCapabilitiesSchema = z.object({
  account: z.object({
    deactivation: z.boolean(),
    deletion: z.boolean(),
  }).strict(),
  notifications: z.object({
    eventKeys: z.array(z.string()),
  }).strict(),
  sellerProfiles: z.object({
    enabled: z.boolean(),
  }).strict(),
}).strict();

export type PlatformCapabilities = z.infer<typeof platformCapabilitiesSchema>;
