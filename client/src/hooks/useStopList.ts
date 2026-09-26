import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateStopEntryInput, DishCategory } from "@stop-list/shared";
import {
  getActiveStopList,
  getHistory,
  returnDish,
  stopDish,
} from "../api/stopList.api";
import { queryKeys } from "./queryKeys";

export function useActiveStopList(category?: DishCategory) {
  return useQuery({
    queryKey: queryKeys.stopList.active(category),
    queryFn: () => getActiveStopList(category).then((r) => r.items),
  });
}

export function useHistory(params: { limit?: number; offset?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.stopList.history(params),
    queryFn: () => getHistory(params),
  });
}

export function useStopDish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateStopEntryInput) => stopDish(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stopList.all });
    },
  });
}

export function useReturnDish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => returnDish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stopList.all });
    },
  });
}
