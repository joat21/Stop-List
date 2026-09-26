import type {
  ActiveStopListResponse,
  HistoryResponse,
  StopListEntryView,
  DishCategory,
  CreateStopEntryInput,
  HistoryQueryInput,
} from "@stop-list/shared";
import { api } from "./http";

export const getActiveStopList = (category?: DishCategory) =>
  api
    .get<ActiveStopListResponse>("/stop-list", { params: { category } })
    .then((r) => r.data);

export const stopDish = (input: CreateStopEntryInput) =>
  api.post<StopListEntryView>("/stop-list", input).then((r) => r.data);

export const returnDish = (id: string) =>
  api.patch<StopListEntryView>(`/stop-list/${id}/return`).then((r) => r.data);

export const getHistory = (query: HistoryQueryInput = {}) =>
  api
    .get<HistoryResponse>("/stop-list/history", { params: query })
    .then((r) => r.data);
