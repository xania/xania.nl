import * as jsx from "@xania/view";
import { XaniaClient } from "../azure-functions";
import { regex } from "../router/matchers";
import { RouteComponent } from "../router/view-resolver";
import { Dish } from "./dish";
import classes from "./list.module.scss";
import { MDCRipple } from "@material/ripple";

export async function MenuCardApp(): Promise<RouteComponent> {
  const menuCard = await loadData();
  return {
    get view() {
      return (
        <div>
          {menuCard.dishes.map((dish) => (
            <a
              href={"/menucard/" + dish.id}
              class={[
                classes["dish"],
                "router-link",
                "mdc-card",
                "mdc-ripple-surface",
              ]}
            >
              {MDCRipple}
              <h3 class={classes["dish__title"]}>{dish.title}</h3>
              <p>{dish.description}</p>
              <span>&euro; {dish.price}</span>
            </a>
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

  return client.api.productList().then((e) => e.data);
  // return fetch("/api/get-menucard", {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // }).then((e) => e.json());
}
