import { Router } from "express";
import {
  CreateStopEntryInput,
  createStopEntrySchema,
  EntryIdParams,
  HistoryQuery,
  historyQuerySchema,
  ListActiveQuery,
  listActiveQuerySchema,
} from "@stop-list/shared";
import { createStopListService } from "../services/stopList.service";
import { asyncHandler } from "../middleware/asyncHandler";
import { validate } from "../middleware/validate";

type StopListService = ReturnType<typeof createStopListService>;

export function createStopListRouter(service: StopListService): Router {
  const router = Router();

  router.post(
    "/",
    validate("body", createStopEntrySchema),
    asyncHandler(async (_req, res) => {
      const input: CreateStopEntryInput = res.locals.body;
      res.status(201).json(await service.stopDish(input));
    }),
  );

  router.get(
    "/",
    validate("query", listActiveQuerySchema),
    asyncHandler(async (_req, res) => {
      const { category }: ListActiveQuery = res.locals.query;
      res.json(await service.listActive(category));
    }),
  );

  router.patch(
    "/:id/return",
    asyncHandler(async (_req, res) => {
      const { id } = res.locals.params as EntryIdParams;
      res.json(await service.returnEntry(id));
    }),
  );

  router.get(
    "/history",
    validate("query", historyQuerySchema),
    asyncHandler(async (_req, res) => {
      const { limit, offset }: HistoryQuery = res.locals.query;
      res.json(await service.getHistory({ limit, offset }));
    }),
  );

  return router;
}
