import { route } from "./router/route-resolver";

export const routes = [
  route(["invoices"], () => import("./invoices").then((e) => e.InvoiceApp)),
  route(["menucard"], () => import("./menucard").then((e) => e.MenuCardApp)),
];
