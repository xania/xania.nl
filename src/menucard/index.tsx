import * as jsx from "@xania/view";
import { XaniaClient } from "../azure-functions";
import { regex } from "../router/matchers";
import { RouteComponent } from "../router/view-resolver";
import { Dish } from "./dish";
import classes from "./list.module.scss";

export async function MenuCardApp(): Promise<RouteComponent> {
  const menuCard = await loadData();
  return {
    get view() {
      return (
        <div>
          {menuCard.dishes.map((dish) => (
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
          const idx = menuCard.dishes.findIndex((d) => d.id == id);
          const dish = menuCard.dishes[idx];
          return <Dish {...dish} />;
        },
      },
    ],
  };
}

function loadData() {
  var client = new XaniaClient({
    baseUrl: "",
  });

  return client.api
    .productList(null, {
      baseUrl: "",
    })
    .then((e) => e.data);
  // return fetch("/api/get-menucard", {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // }).then((e) => e.json());
}
