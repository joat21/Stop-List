import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { ApiError } from "../domain/errors";

type Source = "body" | "query" | "params";

export const validate =
  (source: Source, schema: ZodType): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const { issues } = result.error;

      const isStructural = issues.some((i) => i.path.length === 0);
      if (isStructural) {
        throw ApiError.badRequest(
          source === "body"
            ? "Тело запроса должно быть JSON-объектом"
            : "Некорректные query-параметры",
        );
      }

      throw ApiError.validation(
        "Некорректные данные запроса",
        issues.map((i) => ({
          field: i.path.map(String).join("."),
          message: i.message,
        })),
      );
    }

    res.locals[source] = result.data;
    next();
  };
