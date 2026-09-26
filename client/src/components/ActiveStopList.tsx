import { useEffect, useState } from "react";
import { useActiveStopList, useReturnDish } from "../hooks/useStopList";

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function ActiveStopList() {
  const activeQuery = useActiveStopList();
  const returnDish = useReturnDish();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (activeQuery.isLoading) {
    return <p className="status">Загрузка…</p>;
  }

  if (activeQuery.isError) {
    return (
      <div className="status status--error">
        <p>Не удалось загрузить стоп-лист</p>
        <button type="button" onClick={() => activeQuery.refetch()}>
          Повторить
        </button>
      </div>
    );
  }

  const entries = (activeQuery.data ?? []).filter(
    (e) => new Date(e.expiresAt).getTime() - now > 0,
  );

  if (entries.length === 0) {
    return <p className="status">Все блюда в продаже</p>;
  }

  return (
    <ul className="active-list">
      {entries.map((entry) => {
        const remainingMs = new Date(entry.expiresAt).getTime() - now;
        return (
          <li key={entry.id} className="active-list__item">
            <div>
              <p className="active-list__name">{entry.dish.name}</p>
              <p className="active-list__reason">{entry.reason}</p>
            </div>
            <div className="active-list__right">
              <span className="active-list__timer">
                {formatRemaining(remainingMs)}
              </span>
              <button
                type="button"
                onClick={() => returnDish.mutate(entry.id)}
                disabled={returnDish.isPending}
              >
                Вернуть
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
