import { StopListEntry } from "@stop-list/shared";
import {
  PrismaClient,
  StopListEntry as PrismaStopListEntry,
} from "../generated/prisma/client";
import { StopListRepo } from "./types";

function toDomain(entry: PrismaStopListEntry): StopListEntry {
  return {
    id: entry.id,
    dishId: entry.dishId,
    reason: entry.reason,
    stoppedAt: entry.stoppedAt.toISOString(),
    expiresAt: entry.expiresAt.toISOString(),
    returnedAt: entry.returnedAt ? entry.returnedAt.toISOString() : null,
  };
}

export function createStopListRepo(prisma: PrismaClient): StopListRepo {
  return {
    async findAll() {
      const entries = await prisma.stopListEntry.findMany();
      return entries.map(toDomain);
    },

    async findByDishId(dishId) {
      const entries = await prisma.stopListEntry.findMany({
        where: { dishId },
      });
      return entries.map(toDomain);
    },

    async findById(id) {
      const entry = await prisma.stopListEntry.findUnique({ where: { id } });
      return entry ? toDomain(entry) : null;
    },

    async create(data) {
      const entry = await prisma.stopListEntry.create({
        data: {
          dishId: data.dishId,
          reason: data.reason,
          stoppedAt: new Date(data.stoppedAt),
          expiresAt: new Date(data.expiresAt),
          returnedAt: data.returnedAt ? new Date(data.returnedAt) : null,
        },
      });

      return toDomain(entry);
    },

    async markReturned(id, returnedAt) {
      const row = await prisma.stopListEntry.update({
        where: { id },
        data: { returnedAt: new Date(returnedAt) },
      });
      return toDomain(row);
    },
  };
}
