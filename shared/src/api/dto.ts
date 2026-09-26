import type { Dish, StopListEntryView } from "../domain/stopList";

export interface FieldIssue {
  field: string;
  message: string;
}

export interface ErrorResponse {
  error: { code: string; message: string; details?: FieldIssue[] };
}

export interface ItemsResponse<T> {
  items: T[];
}
export interface PageResponse<T> extends ItemsResponse<T> {
  total: number;
  limit: number;
  offset: number;
}

export type DishListResponse = ItemsResponse<Dish>;
export type ActiveStopListResponse = ItemsResponse<StopListEntryView>;
export type HistoryResponse = PageResponse<StopListEntryView>;
