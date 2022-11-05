import { Path } from "./path";
import * as Rx from "rxjs";
import * as Ro from "rxjs/operators";
import { RouteTrigger } from "./router";

const clicks$ = clicks();

const locations$ = Rx.timer(0, 200).pipe(
  Ro.map<unknown, RouteInput>(() => ({
    pathname: location.pathname,
    trigger: RouteTrigger.Location,
  }))
);

export function createBrowser(virtualPath: Path) {
  return {
    routes: Rx.merge(locations$, clicks$, popStates$).pipe(
      Ro.distinctUntilChanged((x, y) => x.pathname == y.pathname),
      Ro.map(({ trigger, pathname }) => ({
        trigger,
        path: pathname.split("/").filter((x) => !!x),
      })),
      Ro.filter((route) => startsWith(route.path, virtualPath))
    ),
    execute(path: string[]) {
      pushPath(path.join("/"));
    },
  };
}

interface RouteInput {
  pathname: string;
  trigger: RouteTrigger;
}

function clicks() {
  return new Rx.Observable<RouteInput>((subscriber) => {
    document.body.addEventListener("click", onClick);
    function onClick(event) {
      if (event.target) {
        let anchor: HTMLAnchorElement = event.target.closest("a");

        if (anchor && anchor.classList.contains("router-link")) {
          event.preventDefault();
          const href = anchor.getAttribute("href");

          if (href && anchor["pathname"] && location.host === anchor["host"]) {
            const pathname = anchor["pathname"];
            pushPath(pathname);
            subscriber.next({
              pathname,
              trigger: RouteTrigger.Click,
            });

            event.returnValue = false;
            return false;
          }
        }
      }
    }

    return function () {
      document.body.removeEventListener("click", onClick);
    };
  });
}

function startsWith(route: Path, base: Path) {
  if (base.length === 0) return true;

  if (base.length > route.length) return false;

  for (var i = 0; i < base.length; i++) {
    if (pathCompare(base[i], route[i]) === false) return false;
  }

  return true;

  function pathCompare(prev: any, next: any) {
    if (prev !== next) {
      if (typeof prev === "string") return false;

      if (prev.toString() !== next) return false;
    }

    return true;
  }
}

function pushPath(pathname: string) {
  let { pathname: old } = window.location;

  if (old + "/" === pathname) {
    console.log("replaceState", pathname);
    window.history.replaceState(pathname, null, pathname);
  } else if (old !== pathname) {
    window.history.pushState(pathname, null, pathname);
  } else {
    // console.error("same as ", pathname);
  }
}

const popStates$ = new Rx.Observable<RouteInput>((subscriber) => {
  window.addEventListener("popstate", onPopState);
  function onPopState(event: PopStateEvent) {
    subscriber.next({
      pathname: location.pathname,
      trigger: RouteTrigger.PopState,
    });
  }

  return function () {
    window.removeEventListener("popstate", onPopState);
  };
});

if ("scrollRestoration" in history) {
  // Back off, browser, I got this...
  history.scrollRestoration = "manual";
}
