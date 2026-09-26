import request from "supertest";
import { describe, it, expect, beforeEach } from "vitest";
import { StopListStatus } from "@stop-list/shared";
import { createApp } from "../../app";
import { prisma } from "../../db";

const app = createApp();

beforeEach(async () => {
  await prisma.stopListEntry.deleteMany();
});

describe("POST /api/stop-list", () => {
  it("201: ставит блюдо в стоп и возвращает view с рассчитанным expiresAt", async () => {
    const res = await request(app).post("/api/stop-list").send({
      dishId: "d1",
      reason: "Закончилась говядина",
      durationMinutes: 30,
    });

    expect(res.status).toBe(201);
    expect(res.body.dish.id).toBe("d1");
    expect(res.body.status).toBe(StopListStatus.ACTIVE);
    expect(res.body.returnedAt).toBeNull();
  });

  it("404: dishId не найден в справочнике", async () => {
    const res = await request(app).post("/api/stop-list").send({
      dishId: "nonexistent",
      reason: "Причина постановки",
      durationMinutes: 30,
    });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("DISH_NOT_FOUND");
  });

  it("409: повторная постановка уже активного блюда", async () => {
    await request(app)
      .post("/api/stop-list")
      .send({ dishId: "d1", reason: "Причина первая", durationMinutes: 30 });

    const res = await request(app)
      .post("/api/stop-list")
      .send({ dishId: "d1", reason: "Причина вторая", durationMinutes: 30 });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("DISH_ALREADY_STOPPED");
  });

  it("422: reason короче 5 символов после trim", async () => {
    const res = await request(app)
      .post("/api/stop-list")
      .send({ dishId: "d1", reason: "  ок ", durationMinutes: 30 });

    expect(res.status).toBe(422);
    expect(res.body.error.details).toContainEqual(
      expect.objectContaining({ field: "reason" }),
    );
  });
});

describe("PATCH /api/stop-list/:id/return", () => {
  it("409: повторный возврат уже возвращённой записи", async () => {
    const created = await request(app).post("/api/stop-list").send({
      dishId: "d1",
      reason: "Причина постановки",
      durationMinutes: 30,
    });

    await request(app).patch(`/api/stop-list/${created.body.id}/return`);

    const res = await request(app).patch(
      `/api/stop-list/${created.body.id}/return`,
    );

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("ENTRY_NOT_ACTIVE");
  });
});

describe("GET /api/stop-list/history", () => {
  it("422: limit=0 вне диапазона 1..100 отклоняется", async () => {
    const res = await request(app)
      .get("/api/stop-list/history")
      .query({ limit: 0 });

    expect(res.status).toBe(422);
  });
});
