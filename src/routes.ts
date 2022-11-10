import { route } from "./router/route-resolver";

export const routes = [
  route(["reasult"], () => import("./reasult").then((e) => e.ReasultApp)),
  route(["settings"], () =>
    import("./reasult/settings").then((e) => e.SettingsView)
  ),
  route(["counter"], () =>
    import("./benchmark/counter").then((e) => e.CounterApp)
  ),
  route(["invoices"], () => import("./invoices").then((e) => e.InvoiceApp)),
  route(["menucard"], () => import("./menucard").then((e) => e.MenuCardApp)),
  route(["mollie"], () => import("./mollie").then((e) => e.MollieApp)),
];
