import "./style.scss";
import "./layout/card.scss";
import "./layout/list.scss";
// import { render } from "@xania/view";
import { jsxFactory } from "@xania/view";
import { AdminApp } from "./admin/index";
import { render } from "@xania/view/lib/jsx2/render";
import { DynamicElements } from "./benchmark/howto";
import { TodoApp } from "./benchmark/todo";
import { createBrowser } from "./router/browser-router";
import { createRouteResolver, route } from "./router/route-resolver";

const jsx = jsxFactory();
render(<AdminApp />, document.getElementById("app"));

function Home() {
  console.log("asdfasd");
  return "asdfasdf";
}

const pages = [route(["home"], (_) => Home)];
const router = createBrowser([]);
router.routes.subscribe({
  next(route) {
    console.log(route);
  },
});

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("./sw.js");
// }

window.onerror = function (err) {
  alert(err);
  console.error(err);
};
