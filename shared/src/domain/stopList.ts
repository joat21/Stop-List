export const REASON_MIN_LENGTH = 5;
export const REASON_MAX_LENGTH = 200;
export const DURATION_MIN_MINUTES = 15;
export const DURATION_MAX_MINUTES = 720;
export const HISTORY_LIMIT_DEFAULT = 20;
export const HISTORY_LIMIT_MIN = 1;
export const HISTORY_LIMIT_MAX = 100;
export const HISTORY_OFFSET_DEFAULT = 0;

export const DISH_CATEGORIES = ["Кухня", "Бар", "Десерты"] as const;
export type DishCategory = (typeof DISH_CATEGORIES)[number];

export interface Dish {
  id: string;
  name: string;
  category: DishCategory;
  price: number; // целое, в рублях
}

export interface StopListEntry {
  id: string;
  dishId: string;
  reason: string;
  stoppedAt: string; // ISO 8601
  expiresAt: string; // ISO 8601, stoppedAt + durationMinutes
  returnedAt: string | null;
}

export type StopListStatus = "active" | "returned" | "expired";

export type StopListEntryView = StopListEntry & {
  dish: Dish;
  status: StopListStatus;
  minutesLeft: number; // 0, если запись уже неактивна
};

export interface CreateStopEntryInput {
  dishId: string;
  reason: string;
  durationMinutes: number;
}
