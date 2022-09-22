import * as jsx from "@xania/view";
import classes from "./index.module.scss";

interface DishProps {
  id: number;
  title: string;
  description: string;
  price: number;
}

export function Dish(props: DishProps) {
  return (
    <div class={[classes["dish"], "mdc-card"]}>
      <h3 class={classes["dish__title"]}>{props.title}</h3>
      <p>{props.description}</p>
      <span>&euro; {props.price}</span>
    </div>
  );
}
