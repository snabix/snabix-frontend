import { api, type ApiDataResponse, unwrapApiData } from "@/src/shared/api";

export type RequestProfileDataExportResult = {
  message: string;
};

export async function requestProfileDataExport(): Promise<RequestProfileDataExportResult> {
  const response = await api.post<ApiDataResponse<RequestProfileDataExportResult>>(
    "/auth/me/data-export",
  );

  return unwrapApiData(response.data);
}
