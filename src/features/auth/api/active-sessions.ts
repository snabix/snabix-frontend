import {
  activeUserSessionsResponseSchema,
  getData,
  api,
  type ApiDataResponse,
  unwrapApiData,
} from "@/src/shared/api";
import type {
  ActiveUserSession,
  TerminateSessionResponse,
} from "@/src/features/auth/model/types";

export async function listActiveSessions(): Promise<ActiveUserSession[]> {
  const data = await getData(
    activeUserSessionsResponseSchema,
    "/auth/sessions",
    { errorMessage: "Ответ активных сессий не соответствует ожидаемому формату." },
  );

  return data.items;
}

export async function terminateSession(
  sessionId: string,
): Promise<TerminateSessionResponse> {
  const response = await api.delete<ApiDataResponse<TerminateSessionResponse>>(
    `/auth/sessions/${sessionId}`,
  );

  return unwrapApiData(response.data);
}

export async function terminateOtherSessions(): Promise<TerminateSessionResponse> {
  const response = await api.delete<ApiDataResponse<TerminateSessionResponse>>(
    "/auth/sessions",
  );

  return unwrapApiData(response.data);
}
