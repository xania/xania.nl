import "./style.scss";
import "./layout/card.scss";
import "./layout/list.scss";
import { render } from "@xania/view";
import * as jsx from "@xania/view";
import { AdminApp } from "./admin/index";
import { createBrowser } from "./router/browser-router";
import * as Ro from "rxjs/operators";

console.log(location.pathname);

// const router = createBrowser(["hackernews"]);

// router.routes.pipe(Ro.map((route) => console.log(route.path))).subscribe();

render(<AdminApp />, document.getElementById("app"));

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("./sw.js");
// }

window.onerror = function (err) {
  alert(err);
  console.error(err);
};
