import "server-only";

import type { z } from "zod";
import { publicEnv } from "@/src/shared/config/env";
import { parseApiContract, paginatedContractSchema } from "./runtime-validation";
import type { ApiDataResponse, ApiPaginatedData } from "./response";

type QueryValue = boolean | number | string | null | undefined;

type ServerRequestOptions = {
  errorMessage: string;
  query?: Record<string, QueryValue>;
  revalidate: number;
  tags: string[];
};

export class ServerApiError extends Error {
  public constructor(
    message: string,
    public readonly status: number,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ServerApiError";
  }
}

export function isServerApiError(
  error: unknown,
): error is ServerApiError {
  return error instanceof ServerApiError;
}

export async function serverGetData<TData>(
  schema: z.ZodType<TData>,
  path: string,
  options: ServerRequestOptions,
): Promise<TData> {
  return serverGet(schema, path, options);
}

export async function serverGetPaginated<TItem>(
  itemSchema: z.ZodType<TItem>,
  path: string,
  options: ServerRequestOptions,
): Promise<ApiPaginatedData<TItem>> {
  return serverGet(paginatedContractSchema(itemSchema), path, options);
}

async function serverGet<TData>(
  schema: z.ZodType<TData>,
  path: string,
  options: ServerRequestOptions,
): Promise<TData> {
  const url = buildApiUrl(path, options.query);
  let response: Response;

  try {
    response = await fetch(url, {
      cache: "force-cache",
      credentials: "omit",
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: options.revalidate,
        tags: options.tags,
      },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    throw new ServerApiError(options.errorMessage, 503, { cause: error });
  }

  if (!response.ok) {
    throw new ServerApiError(options.errorMessage, response.status);
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch (error) {
    throw new ServerApiError(options.errorMessage, 502, { cause: error });
  }

  if (!isApiDataResponse(payload)) {
    throw new ServerApiError(options.errorMessage, 502);
  }

  try {
    return parseApiContract(schema, payload.data, options.errorMessage);
  } catch (error) {
    throw new ServerApiError(options.errorMessage, 502, { cause: error });
  }
}

function buildApiUrl(
  path: string,
  query: Record<string, QueryValue> | undefined,
): URL {
  const url = new URL(
    `${publicEnv.apiUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`,
  );

  if (query === undefined) {
    return url;
  }

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

function isApiDataResponse(value: unknown): value is ApiDataResponse<unknown> {
  return typeof value === "object" && value !== null && "data" in value;
}
