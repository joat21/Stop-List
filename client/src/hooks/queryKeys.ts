import type { DishCategory } from "@stop-list/shared";

export const queryKeys = {
  dishes: ["dishes"] as const,
  stopList: {
    all: ["stop-list"] as const,
    active: (category?: DishCategory) =>
      ["stop-list", "active", category] as const,
    history: (params: { limit?: number; offset?: number }) =>
      ["stop-list", "history", params] as const,
  },
};
