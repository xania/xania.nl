import * as jsx from "@xania/view";
import {
  MultiChoiceOption,
  Product,
  ProductOption,
} from "../../azure-functions";
import classes from "./index.module.scss";
import { MDCRipple } from "@material/ripple";
import { Page, PageContent } from "../../layout/page";
import { PageHeader } from "../../layout/page/header";

export function Dish(product: Product) {
  return (
    <Page>
      <PageHeader title={product.title} backUrl="/menucard" />
      <PageContent>
        <div class={classes["dish"]}>
          <div class="mdc-typography--subtitle1">{product.description}</div>
          <span>&euro; {product.price}</span>
        </div>
        {product.options.map((o) =>
          o.type == "multi" ? <DishOptions {...o} /> : <Option {...o} />
        )}
        {product.options.map((o) =>
          o.type == "multi" ? <DishOptions {...o} /> : <Option {...o} />
        )}
        {product.options.map((o) =>
          o.type == "multi" ? <DishOptions {...o} /> : <Option {...o} />
        )}
      </PageContent>
    </Page>
  );
}

function DishOptions(m: MultiChoiceOption) {
  return (
    <div class={classes["dish__options"]}>
      <div class="mdc-typography--subtitle1">{m.name}</div>
      <div class={["mdc-list-group", "mdc-card"]}>
        <ul class="mdc-list">
          {m.options.map((o) => (
            <Option {...o} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function Option(o: ProductOption) {
  return (
    <li
      class="mdc-list-item mdc-list-item--with-one-line mdc-list-item--with-trailing-button mdc-ripple-surface"
      tabIndex={0}
    >
      {MDCRipple}

      <span class="mdc-list-item__content">{o.value}</span>

      <button class="mdc-list-item__end mdc-icon-button material-icons">
        add
      </button>
    </li>
  );
}

function Svg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40}>
      <g fill="none" fill-rule="evenodd">
        <path
          d="M20 0C8.96 0 0 8.96 0 20s8.96 20 20 20 20-8.96 20-20S31.04 0 20 0z"
          fill="#9e9e9e"
          fill-rule="nonzero"
        ></path>
        <path
          d="M20 17.727c2.767 0 5-2.233 5-5s-2.233-5-5-5-5 2.233-5 5 2.233 5 5 5zm0 2.954c-6.11 0-10.908 2.954-10.908 5.681A13.018 13.018 0 0 0 20 32.271c4.552 0 8.598-2.354 10.908-5.909 0-2.727-4.798-5.68-10.908-5.68z"
          fill="#ececec"
          fill-rule="nonzero"
        ></path>
        <path d="M0 0h40v40H0z"></path>
      </g>
    </svg>
  );
}
