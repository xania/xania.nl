import { jsxFactory } from "@xania/view";
import classes from "./roller.module.scss";

const jsx = jsxFactory({ classes });

export function Roller() {
  return (
    <div class="lds-roller">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
