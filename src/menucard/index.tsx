import * as jsx from "@xania/view";
import { Dish } from "./dish";

export async function MenuCardApp() {
  const data = await loadData();
  return (
    <div>
      {data.dishes.map((dish) => (
        <Dish {...dish} />
      ))}
    </div>
  );
}

function loadData() {
  return fetch("/api/get-menucard", {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((e) => e.json());
}
