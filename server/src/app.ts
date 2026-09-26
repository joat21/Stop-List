import express from "express";
import { prisma } from "./db";
import { createDishRepo } from "./repositories/dishes.repo";
import { createStopListRepo } from "./repositories/stopList.repo";
import { createDishesService } from "./services/dishes.service";
import { createStopListService } from "./services/stopList.service";
import { createDishesRouter } from "./routes/dishes.routes";
import { createStopListRouter } from "./routes/stopList.routes";

export function createApp() {
  const app = express();
  app.use(express.json());

  const dishRepo = createDishRepo();
  const stopListRepo = createStopListRepo(prisma);

  const dishesService = createDishesService({ dishes: dishRepo });
  const stopListService = createStopListService({
    dishes: dishRepo,
    stopList: stopListRepo,
    now: () => new Date(),
  });

  app.use("/api/dishes", createDishesRouter(dishesService));
  app.use("/api/stop-list", createStopListRouter(stopListService));

  return app;
}
