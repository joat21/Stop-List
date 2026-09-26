import type { Dish } from '@stop-list/shared';

interface StopDishFormProps {
  dish: Dish | null;
  onDone: () => void;
}

export function StopDishForm({ dish }: StopDishFormProps) {
  if (!dish) {
    return <p className="status">Выберите блюдо слева, чтобы поставить его в стоп</p>;
  }

  return <p className="status">Форма постановки в стоп</p>;
}