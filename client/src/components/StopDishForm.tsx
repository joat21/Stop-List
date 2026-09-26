import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createStopEntrySchema,
  type CreateStopEntryInput,
  type Dish,
} from "@stop-list/shared";
import { useStopDish } from "../hooks/useStopList";
import { ApiClientError } from "../api/http";

interface StopDishFormProps {
  dish: Dish | null;
  onDone: () => void;
}

export function StopDishForm({ dish, onDone }: StopDishFormProps) {
  const stopDish = useStopDish();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateStopEntryInput>({
    resolver: zodResolver(createStopEntrySchema),
    mode: "onTouched",
    values: dish
      ? { dishId: dish.id, reason: "", durationMinutes: 30 }
      : undefined,
  });

  if (!dish) {
    return (
      <p className="status">Выберите блюдо слева, чтобы поставить его в стоп</p>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      await stopDish.mutateAsync(values);
      reset();
      onDone();
    } catch (err) {
      if (err instanceof ApiClientError && err.details?.length) {
        // 422 — раскладываем по полям
        err.details.forEach((d) => {
          setError(d.field as keyof CreateStopEntryInput, {
            message: d.message,
          });
        });
        return;
      }
      // 404/409/сеть — общая ошибка формы
      const message =
        err instanceof ApiClientError
          ? err.message
          : "Не удалось выполнить запрос";
      setError("root", { message });
    }
  });

  return (
    <form onSubmit={onSubmit} className="stop-form" noValidate>
      <p className="stop-form__dish">{dish.name}</p>
      <input type="hidden" {...register("dishId")} />

      <label className="field">
        <span>Причина</span>
        <textarea {...register("reason")} rows={3} />
        {errors.reason && (
          <span className="field__error">{errors.reason.message}</span>
        )}
      </label>

      <label className="field">
        <span>Срок (мин)</span>
        <input
          type="number"
          {...register("durationMinutes", { valueAsNumber: true })}
        />
        {errors.durationMinutes && (
          <span className="field__error">{errors.durationMinutes.message}</span>
        )}
      </label>

      {errors.root && (
        <p className="field__error field__error--root">{errors.root.message}</p>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Отправка…" : "Поставить в стоп"}
      </button>
    </form>
  );
}
