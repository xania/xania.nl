import * as jsx from "@xania/view";
import { route } from "./router/view-resolver";
import { HomeComponent } from "./home";
import { createWebApp } from "./router/webapp";
import * as matchers from "./router/matchers";
import "./style.scss";

function AdminComponent() {
  return <div>Admin Component</div>;
}

createWebApp([
  route(matchers.empty, HomeComponent),
  route(["a"], AdminComponent),
  route(["invoices"], () => import("./invoices").then((e) => e.InvoiceApp)),
  route(["menucard"], () => import("./menucard").then((e) => e.MenuCardApp)),
]).render(document.getElementById("app"));
