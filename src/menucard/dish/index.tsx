import * as jsx from "@xania/view";
import { Product } from "../../azure-functions";
import classes from "./index.module.scss";

export function Dish(props: Product) {
  return (
    <div class={[classes["dish"], "mdc-card"]}>
      <h3 class={classes["dish__title"]}>{props.title}</h3>
      <p>{props.description}</p>
      <span>&euro; {props.price}</span>
    </div>
  );
}
