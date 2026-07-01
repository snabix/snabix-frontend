import { z } from "zod";

export const nullableStringSchema = z.string().nullable();
export const stringOrNumberSchema = z.union([z.string(), z.number()]);
