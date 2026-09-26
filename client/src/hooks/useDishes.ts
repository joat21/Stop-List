import { useQuery } from "@tanstack/react-query";
import { getDishes } from "../api/dishes.api";
import { queryKeys } from "./queryKeys";

export function useDishes() {
  return useQuery({
    queryKey: queryKeys.dishes,
    queryFn: getDishes,
  });
}
