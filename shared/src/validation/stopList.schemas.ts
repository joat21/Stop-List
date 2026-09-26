import { z } from "zod";
import {
  DISH_CATEGORIES,
  REASON_MIN_LENGTH,
  REASON_MAX_LENGTH,
  DURATION_MIN_MINUTES,
  DURATION_MAX_MINUTES,
  HISTORY_LIMIT_DEFAULT,
  HISTORY_LIMIT_MIN,
  HISTORY_LIMIT_MAX,
  HISTORY_OFFSET_DEFAULT,
} from "../domain/stopList";

export const createStopEntrySchema = z.object({
  dishId: z.string().min(1, "ID блюда обязателен"),
  reason: z
    .string()
    .trim()
    .min(
      REASON_MIN_LENGTH,
      `Причина должна быть от ${REASON_MIN_LENGTH} до ${REASON_MAX_LENGTH} символов`,
    )
    .max(
      REASON_MAX_LENGTH,
      `Причина должна быть от ${REASON_MIN_LENGTH} до ${REASON_MAX_LENGTH} символов`,
    ),
  durationMinutes: z
    .number()
    .int("Длительность должна быть целым числом")
    .min(
      DURATION_MIN_MINUTES,
      `Длительность должна быть от ${DURATION_MIN_MINUTES} до ${DURATION_MAX_MINUTES} минут`,
    )
    .max(
      DURATION_MAX_MINUTES,
      `Длительность должна быть от ${DURATION_MIN_MINUTES} до ${DURATION_MAX_MINUTES} минут`,
    ),
});

export const listActiveQuerySchema = z.object({
  category: z.enum(DISH_CATEGORIES).optional(),
});

export const historyQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int("limit должен быть целым числом")
    .min(HISTORY_LIMIT_MIN)
    .max(HISTORY_LIMIT_MAX)
    .default(HISTORY_LIMIT_DEFAULT),
  offset: z.coerce
    .number()
    .int("offset должен быть целым числом")
    .min(HISTORY_OFFSET_DEFAULT)
    .default(HISTORY_OFFSET_DEFAULT),
});

export type CreateStopEntryInput = z.infer<typeof createStopEntrySchema>;
export type ListActiveQuery = z.infer<typeof listActiveQuerySchema>;
export type HistoryQueryInput = z.input<typeof historyQuerySchema>;
export type HistoryQuery = z.output<typeof historyQuerySchema>;
