import type { DishListResponse } from "@stop-list/shared";
import { api } from "./http";

export const getDishes = () =>
  api.get<DishListResponse>("/dishes").then((r) => r.data);
