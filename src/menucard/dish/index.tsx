import * as jsx from "@xania/view";
import { Product } from "../../azure-functions";
import classes from "./index.module.scss";

export function Dish(product: Product) {
  return (
    <div class={[classes["dish"], "mdc-card"]}>
      <h3 class={classes["dish__title"]}>{product.title}</h3>
      <p>{product.description}</p>
      <span>&euro; {product.price}</span>
      {product.options.map((o) => (
        <div>{o.type}</div>
      ))}
    </div>
  );
}
