import { z } from "zod";

export function parseApiContract<TData>(
  schema: z.ZodType<TData>,
  data: unknown,
  fallbackMessage: string,
): TData {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(fallbackMessage);
  }

  return result.data;
}

export function paginatedContractSchema<TItem extends z.ZodType>(
  itemSchema: TItem,
) {
  return z.object({
    items: z.array(itemSchema),
    meta: z.object({
      currentPage: z.number(),
      from: z.number().nullable(),
      lastPage: z.number(),
      perPage: z.number(),
      to: z.number().nullable(),
      total: z.number(),
    }).passthrough(),
  }).passthrough();
}
