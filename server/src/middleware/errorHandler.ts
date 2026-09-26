import { NextFunction, Request, Response } from "express";
import { ApiError } from "../domain/errors";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("[Error]", err);

  if (isJsonParseError(err)) {
    return res.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "Некорректный JSON",
      },
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details }),
      },
    });
  }

  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Внутренняя ошибка сервера",
    },
  });
};

const isJsonParseError = (error: unknown): boolean =>
  error !== null &&
  typeof error === "object" &&
  "type" in error &&
  error.type === "entity.parse.failed";
