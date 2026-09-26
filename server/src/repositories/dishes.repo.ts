import type { DishRepo } from "./types";
import { DISHES } from "../seed/dishes";

export function createDishRepo(): DishRepo {
  return {
    async findAll() {
      return DISHES;
    },
    async findById(id) {
      return DISHES.find((d) => d.id === id) ?? null;
    },
  };
}
