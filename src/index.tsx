import "./style.scss";
import "./layout/card.scss";
import "./layout/list.scss";
import { render } from "@xania/view";
import * as jsx from "@xania/view";
import { AdminApp } from "./admin/index";
import { queryClusters } from "./reasult/api/db";

render(<AdminApp />, document.getElementById("app"));

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("./sw.js");
// }

window.onerror = function (err) {
  alert(err);
  console.error(err);
};
