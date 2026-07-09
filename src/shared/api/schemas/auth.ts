import { z } from "zod";
import { nullableStringSchema } from "./common";

const userAddressSchema = z.object({
  id: z.string(),
  label: nullableStringSchema,
  addressLine: nullableStringSchema,
  isPrimary: z.boolean(),
  region: z.object({
    id: z.number(),
    name: z.string(),
    fullName: z.string().optional(),
    label: z.string(),
  }).strict(),
  city: z.object({
    id: z.number(),
    name: z.string(),
    label: z.string(),
  }).strict().nullable(),
}).strict();

const userAvatarSchema = z.object({
  id: z.number(),
  url: nullableStringSchema,
  fileName: z.string(),
  mimeType: nullableStringSchema,
  size: z.number(),
  humanReadableSize: z.string(),
}).strict();

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: nullableStringSchema,
  addresses: z.array(userAddressSchema),
  isActive: z.boolean(),
  emailVerifiedAt: nullableStringSchema,
  avatar: userAvatarSchema.nullable(),
}).strict();

export const activeUserSessionSchema = z.object({
  id: z.string(),
  deviceName: z.string(),
  browser: z.string(),
  ipAddress: nullableStringSchema,
  locationLabel: z.string(),
  type: z.enum(["desktop", "mobile", "tablet"]),
  isCurrent: z.boolean(),
  lastActivityAt: nullableStringSchema,
}).strict();

export const activeUserSessionsResponseSchema = z.object({
  items: z.array(activeUserSessionSchema),
}).strict();
