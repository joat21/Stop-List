import type { FieldIssue } from "@stop-list/shared";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: FieldIssue[],
  ) {
    super(message);
    this.name = "ApiError";
  }

  static notFound(code: string, message: string) {
    return new ApiError(404, code, message);
  }

  static conflict(code: string, message: string) {
    return new ApiError(409, code, message);
  }

  static validation(message: string, details: FieldIssue[] = []) {
    return new ApiError(422, "INVALID_INPUT", message, details);
  }

  static badRequest(message: string) {
    return new ApiError(400, "BAD_REQUEST", message);
  }
}
