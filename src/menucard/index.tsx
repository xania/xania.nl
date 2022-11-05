import { jsxFactory } from "@xania/view";
import { XaniaClient } from "../azure-functions";
import { regex } from "../router/matchers";
import { RouteComponent } from "../router/route-resolver";
import { Dish } from "./dish";
import classes from "./list.module.scss";
import { MDCRipple } from "@material/ripple";
import { Page, PageContent } from "../layout/page";
import { PageHeader } from "../layout/page/header";

const jsx = jsxFactory({ classes });

export async function MenuCardApp(): Promise<RouteComponent> {
  const menuCard = await loadData();
  return {
    get view() {
      return (
        <Page>
          <PageHeader title="Menucard" backUrl="/" />
          <PageContent>
            {menuCard.dishes.map((dish) => (
              <a
                href={"/menucard/" + dish.id}
                class={[
                  "dish",
                  "router-link",
                  "mdc-card",
                  "mdc-ripple-surface",
                ]}
              >
                {MDCRipple}
                <h3 class={"dish__title"}>{dish.title}</h3>
                <p>{dish.description}</p>
                <span>&euro; {dish.price}</span>
              </a>
            ))}
          </PageContent>
        </Page>
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
