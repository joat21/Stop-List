import { Dish, StopListEntry } from "@stop-list/shared";

export interface DishRepo {
  findAll(): Promise<Dish[]>;
  findById(id: string): Promise<Dish | null>;
}

export interface StopListRepo {
  findAll(): Promise<StopListEntry[]>;
  findByDishId(dishId: string): Promise<StopListEntry[]>;
  findById(id: string): Promise<StopListEntry | null>;
  create(data: Omit<StopListEntry, "id">): Promise<StopListEntry>;
  markReturned(id: string, returnedAt: string): Promise<StopListEntry>;
}
