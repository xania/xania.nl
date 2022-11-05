import { createBrowser } from "./browser-router";
import { Outlet } from "./outlet";
import { RouteInput } from "./route-resolver";

export function createWebApp<TView>(routes: RouteInput<TView>[]) {
  const router = createBrowser([]);
  return Outlet({
    router,
    routes,
  });
}
