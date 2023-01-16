import "./style.scss";
import "./layout/card.scss";
import "./layout/list.scss";
import { jsxFactory } from "@xania/view";
import { AdminApp } from "./admin/index";
import { render } from "@xania/view";

const jsx = jsxFactory();
render(<AdminApp />, document.getElementById("app"));

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("./sw.js");
// }

window.onerror = function (err) {
  alert(err);
  console.error(err);
};
