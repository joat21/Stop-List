import axios, { isAxiosError } from "axios";
import type { ErrorResponse } from "@stop-list/shared";

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: ErrorResponse["error"]["details"];

  constructor(
    status: number,
    code: string,
    message: string,
    details?: ErrorResponse["error"]["details"],
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL ?? "/api",
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError<ErrorResponse>(error)) {
      if (!error.response) {
        return Promise.reject(
          new ApiClientError(
            0,
            "NETWORK_ERROR",
            "Не удалось связаться с сервером",
          ),
        );
      }

      const body = error.response.data;
      return Promise.reject(
        new ApiClientError(
          error.response.status,
          body?.error?.code ?? "UNKNOWN_ERROR",
          body?.error?.message ?? "Не удалось выполнить запрос",
          body?.error?.details,
        ),
      );
    }

    return Promise.reject(error);
  },
);
