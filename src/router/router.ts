import { Path } from "./path";
import * as Rx from "rxjs";

export interface Router {
  routes: Rx.Observable<Route>;
}

export interface Route {
  path: Path;
  trigger: RouteTrigger;
}

export enum RouteTrigger {
  Click,
  Location,
  PopState,
}
