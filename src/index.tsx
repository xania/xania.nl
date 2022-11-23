import "./style.scss";
import "./layout/card.scss";
import "./layout/list.scss";
// import { render } from "@xania/view";
// import * as jsx from "@xania/view";
import { AdminApp } from "./admin/index";
import { jsxFactory } from "@xania/view/lib/jsx2";
import { render } from "@xania/view/lib/jsx2/render";
import { DynamicElements } from "./benchmark/howto";
import { TodoApp } from "./benchmark/todo";

const jsx = jsxFactory();
render(<TodoApp />, document.body);
// render(<AdminApp />, document.getElementById("app"));

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("./sw.js");
// }

window.onerror = function (err) {
  alert(err);
  console.error(err);
};
