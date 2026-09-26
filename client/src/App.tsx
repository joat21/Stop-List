import { useState } from "react";
import type { Dish } from "@stop-list/shared";
import { DishList } from "./components/DishList";
import { StopDishForm } from "./components/StopDishForm";
import { ActiveStopList } from "./components/ActiveStopList";
import "./App.css";

function App() {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  return (
    <div className="app">
      <header className="app__header">
        <h1>Стоп-лист смены</h1>
      </header>

      <main className="app__main">
        <section className="panel">
          <h2>Блюда</h2>
          <DishList
            selectedDishId={selectedDish?.id ?? null}
            onSelectDish={setSelectedDish}
          />
        </section>

        <section className="panel">
          <h2>Поставить в стоп</h2>
          <StopDishForm
            dish={selectedDish}
            onDone={() => setSelectedDish(null)}
          />
        </section>

        <section className="panel">
          <h2>Активный стоп-лист</h2>
          <ActiveStopList />
        </section>
      </main>
    </div>
  );
}

export default App;
