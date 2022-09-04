import { Path } from "./path";
import * as Rx from "rxjs";
import * as Ro from "rxjs/operators";

export interface Router {
  routes: Rx.Observable<Path>;
}
