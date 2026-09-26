import type { Dish } from "@stop-list/shared";
import { useDishes } from "../hooks/useDishes";
import { useActiveStopList } from "../hooks/useStopList";
import clsx from "clsx";

interface DishListProps {
  selectedDishId: string | null;
  onSelectDish: (dish: Dish) => void;
}

export function DishList({ selectedDishId, onSelectDish }: DishListProps) {
  const dishesQuery = useDishes();
  const activeQuery = useActiveStopList();

  if (dishesQuery.isLoading) {
    return <p className="status">Загрузка блюд…</p>;
  }

  if (dishesQuery.isError) {
    return (
      <div className="status status--error">
        <p>Не удалось загрузить блюда</p>
        <button type="button" onClick={() => dishesQuery.refetch()}>
          Повторить
        </button>
      </div>
    );
  }

  const dishes = dishesQuery.data ?? [];
  if (dishes.length === 0) {
    return <p className="status">Блюд пока нет</p>;
  }

  const stoppedDishIds = new Set((activeQuery.data ?? []).map((e) => e.dishId));
  console.log(stoppedDishIds);

  return (
    <ul className="dish-list">
      {dishes.map((dish) => {
        const isStopped = stoppedDishIds.has(dish.id);
        const isSelected = dish.id === selectedDishId;

        return (
          <li key={dish.id}>
            <button
              type="button"
              className={clsx(
                "dish-list__button",
                isSelected && "dish-list__button--selected",
              )}
              disabled={isStopped}
              onClick={() => onSelectDish(dish)}
            >
              <span className="dish-list__name">{dish.name}</span>
              <span className="dish-list__category">{dish.category}</span>
              <span className="dish-list__price">{dish.price} ₽</span>
              {isStopped && <span className="badge">В стопе</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
