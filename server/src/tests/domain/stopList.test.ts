import { describe, it, expect } from "vitest";
import { StopListStatus, type StopListEntry } from "@stop-list/shared";
import { calculateExpiresAt, getStatus, isActive } from "../../domain/stopList";

// Хелпер: собираем запись с базовыми полями, в каждом тесте
// меняем через overrides только то, что реально проверяем
const baseEntry = (overrides: Partial<StopListEntry> = {}): StopListEntry => ({
  id: "entry-1",
  dishId: "d1",
  reason: "Закончился продукт",
  stoppedAt: "2026-01-01T12:00:00.000Z",
  expiresAt: "2026-01-01T12:30:00.000Z", // +30 минут от stoppedAt
  returnedAt: null,
  ...overrides,
});

describe("isActive — момент истечения", () => {
  it("активна за секунду до expiresAt", () => {
    expect(isActive(baseEntry(), new Date("2026-01-01T12:29:59.000Z"))).toBe(
      true,
    );
  });

  it("неактивна ровно в expiresAt", () => {
    expect(isActive(baseEntry(), new Date("2026-01-01T12:30:00.000Z"))).toBe(
      false,
    );
  });
});

describe("getStatus — expired отличается от returned", () => {
  it("EXPIRED: returnedAt всё ещё null, но время вышло само", () => {
    const status = getStatus(baseEntry(), new Date("2026-01-01T13:00:00.000Z"));
    expect(status).toBe(StopListStatus.EXPIRED);
  });
});

describe("calculateExpiresAt — границы durationMinutes", () => {
  it("15 минут (нижняя граница)", () => {
    expect(calculateExpiresAt(new Date("2026-01-01T12:00:00.000Z"), 15)).toBe(
      "2026-01-01T12:15:00.000Z",
    );
  });

  it("720 минут (верхняя граница)", () => {
    expect(calculateExpiresAt(new Date("2026-01-01T12:00:00.000Z"), 720)).toBe(
      "2026-01-02T00:00:00.000Z",
    );
  });
});
