import { Dish } from "@stop-list/shared";
import { DishRepo } from "../repositories/types";

export function createDishesService(deps: { dishes: DishRepo }) {
  return {
    async list(): Promise<Dish[]> {
      return deps.dishes.findAll();
    },
  };
}
