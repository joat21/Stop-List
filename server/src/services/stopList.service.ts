import {
  CreateStopEntryInput,
  DishCategory,
  HistoryResponse,
  StopListEntryView,
} from "@stop-list/shared";
import { DishRepo, StopListRepo } from "../repositories/types";
import { ApiError } from "../domain/errors";
import { isActive, MS_PER_MINUTE, toView } from "../domain/stopList";

export function createStopListService(deps: {
  stopList: StopListRepo;
  dishes: DishRepo;
  now: () => Date;
}) {
  return {
    async stopDish(input: CreateStopEntryInput): Promise<StopListEntryView> {
      const dish = await deps.dishes.findById(input.dishId);
      if (!dish)
        throw ApiError.notFound(
          "DISH_NOT_FOUND",
          `Блюдо ${input.dishId} не найдено`,
        );

      const now = deps.now();
      const existing = await deps.stopList.findByDishId(input.dishId);
      if (existing.some((entry) => isActive(entry, now))) {
        throw ApiError.conflict(
          "DISH_ALREADY_STOPPED",
          "Блюдо уже в стоп-листе",
        );
      }

      const entry = await deps.stopList.create({
        dishId: dish.id,
        reason: input.reason.trim(),
        stoppedAt: now.toISOString(),
        expiresAt: new Date(
          now.getTime() + input.durationMinutes * MS_PER_MINUTE,
        ).toISOString(),
        returnedAt: null,
      });

      return toView(entry, dish, now);
    },

    async listActive(category?: DishCategory): Promise<StopListEntryView[]> {
      const now = deps.now();
      const [entries, dishes] = await Promise.all([
        deps.stopList.findAll(),
        deps.dishes.findAll(),
      ]);
      const dishById = new Map(dishes.map((d) => [d.id, d]));

      return entries
        .filter((e) => isActive(e, now))
        .map((e) => toView(e, dishById.get(e.dishId)!, now))
        .filter((view) => !category || view.dish.category === category)
        .sort(
          (a, b) =>
            new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime(),
        );
    },

    async returnEntry(id: string): Promise<StopListEntryView> {
      const entry = await deps.stopList.findById(id);
      if (!entry)
        throw ApiError.notFound("ENTRY_NOT_FOUND", `Запись ${id} не найдена`);

      const now = deps.now();
      if (!isActive(entry, now)) {
        throw ApiError.conflict("ENTRY_NOT_ACTIVE", "Запись уже не активна");
      }

      const updated = await deps.stopList.markReturned(id, now.toISOString());
      const dish = await deps.dishes.findById(updated.dishId);
      return toView(updated, dish!, now);
    },

    async getHistory(pagination: {
      limit: number;
      offset: number;
    }): Promise<HistoryResponse> {
      const now = deps.now();
      const [entries, dishes] = await Promise.all([
        deps.stopList.findAll(),
        deps.dishes.findAll(),
      ]);
      const dishById = new Map(dishes.map((d) => [d.id, d]));

      const finished = entries
        .filter((e) => !isActive(e, now))
        .map((e) => toView(e, dishById.get(e.dishId)!, now))
        .sort(
          (a, b) =>
            new Date(b.returnedAt ?? b.expiresAt).getTime() -
            new Date(a.returnedAt ?? a.expiresAt).getTime(),
        );

      return {
        items: finished.slice(
          pagination.offset,
          pagination.offset + pagination.limit,
        ),
        total: finished.length,
        limit: pagination.limit,
        offset: pagination.offset,
      };
    },
  };
}
