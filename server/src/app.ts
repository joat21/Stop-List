import express from "express";
import { createDishRepo } from "./repositories/dishes.repo";
import { createDishesService } from "./services/dishes.service";
import { createDishesRouter } from "./routes/dishes.routes";

export function createApp() {
  const app = express();
  app.use(express.json());

  const dishRepo = createDishRepo();
  const dishesService = createDishesService({ dishes: dishRepo });

  app.use("/api/dishes", createDishesRouter(dishesService));

  return app;
}
