import type { AxiosRequestConfig } from "axios";
import type { z } from "zod";
import { api } from "./axios";
import { paginatedContractSchema, parseApiContract } from "./runtime-validation";
import type { ApiDataResponse, ApiPaginatedData } from "./response";
import { unwrapApiData } from "./response";

type ContractRequestOptions = {
  config?: AxiosRequestConfig;
  errorMessage: string;
};

export async function getData<TData>(
  schema: z.ZodType<TData>,
  url: string,
  options: ContractRequestOptions,
): Promise<TData> {
  const response = options.config
    ? await api.get<ApiDataResponse<unknown>>(url, options.config)
    : await api.get<ApiDataResponse<unknown>>(url);

  return parseResponse(schema, response.data, options.errorMessage);
}

export async function getPaginated<TItem>(
  itemSchema: z.ZodType<TItem>,
  url: string,
  options: ContractRequestOptions,
): Promise<ApiPaginatedData<TItem>> {
  const response = options.config
    ? await api.get<ApiDataResponse<unknown>>(url, options.config)
    : await api.get<ApiDataResponse<unknown>>(url);

  return parseResponse(
    paginatedContractSchema(itemSchema),
    response.data,
    options.errorMessage,
  );
}

export async function postData<TData, TPayload = undefined>(
  schema: z.ZodType<TData>,
  url: string,
  payload: TPayload | undefined,
  options: ContractRequestOptions,
): Promise<TData> {
  const response = await postRequest(url, payload, options.config);

  return parseResponse(schema, response.data, options.errorMessage);
}

export async function patchData<TData, TPayload = undefined>(
  schema: z.ZodType<TData>,
  url: string,
  payload: TPayload | undefined,
  options: ContractRequestOptions,
): Promise<TData> {
  const response = await patchRequest(url, payload, options.config);

  return parseResponse(schema, response.data, options.errorMessage);
}

export async function deleteData<TData>(
  schema: z.ZodType<TData>,
  url: string,
  options: ContractRequestOptions,
): Promise<TData> {
  const response = options.config
    ? await api.delete<ApiDataResponse<unknown>>(url, options.config)
    : await api.delete<ApiDataResponse<unknown>>(url);

  return parseResponse(schema, response.data, options.errorMessage);
}

function parseResponse<TData>(
  schema: z.ZodType<TData>,
  response: ApiDataResponse<unknown>,
  errorMessage: string,
): TData {
  return parseApiContract(schema, unwrapApiData(response), errorMessage);
}

async function postRequest<TPayload>(
  url: string,
  payload: TPayload | undefined,
  config: AxiosRequestConfig | undefined,
) {
  if (payload === undefined) {
    return config
      ? api.post<ApiDataResponse<unknown>>(url, undefined, config)
      : api.post<ApiDataResponse<unknown>>(url);
  }

  return config
    ? api.post<ApiDataResponse<unknown>>(url, payload, config)
    : api.post<ApiDataResponse<unknown>>(url, payload);
}

async function patchRequest<TPayload>(
  url: string,
  payload: TPayload | undefined,
  config: AxiosRequestConfig | undefined,
) {
  if (payload === undefined) {
    return config
      ? api.patch<ApiDataResponse<unknown>>(url, undefined, config)
      : api.patch<ApiDataResponse<unknown>>(url);
  }

  return config
    ? api.patch<ApiDataResponse<unknown>>(url, payload, config)
    : api.patch<ApiDataResponse<unknown>>(url, payload);
}
