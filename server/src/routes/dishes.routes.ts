import { Router } from "express";
import type { Dish, ItemsResponse } from "@stop-list/shared";
import type { createDishesService } from "../services/dishes.service";
import { asyncHandler } from "../middleware/asyncHandler";

type DishesService = ReturnType<typeof createDishesService>;

export function createDishesRouter(service: DishesService): Router {
  const router = Router();

  router.get(
    "/",
    asyncHandler(async (_req, res) => {
      res.json({ items: await service.list() } satisfies ItemsResponse<Dish>);
    }),
  );

  return router;
}
