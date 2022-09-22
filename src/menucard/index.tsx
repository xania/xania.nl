import * as jsx from "@xania/view";
import { regex } from "../router/matchers";
import { RouteComponent } from "../router/view-resolver";
import { Dish } from "./dish";
import classes from "./list.module.scss";

export async function MenuCardApp(): Promise<RouteComponent> {
  const data = await loadData();
  return {
    get view() {
      return (
        <div>
          {data.dishes.map((dish) => (
            <div class={[classes["dish"], "mdc-card"]}>
              <h3 class={classes["dish__title"]}>
                <a href={"/menucard/" + dish.id} class="router-link">
                  {dish.title}
                </a>
              </h3>
              <p>{dish.description}</p>
              <span>&euro; {dish.price}</span>
            </div>
          ))}
        </div>
      );
    },

    routes: [
      {
        match: regex(/(?<id>\d+)/i),
        component(params) {
          const { id } = params;
          const idx = data.dishes.findIndex((d) => d.id == id);
          const dish = data.dishes[idx];
          return <Dish {...dish} />;
        },
      },
    ],
  };
}

function DishComponent(dish) {
  return <div>{dish.title}</div>;
}

function loadData() {
  return fetch("/api/get-menucard", {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((e) => e.json());
}
