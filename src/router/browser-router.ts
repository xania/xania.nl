import { Path } from "./path";
import * as Rx from "rxjs";
import * as Ro from "rxjs/operators";

export function createBrowser(virtualPath: Path) {
  return {
    routes: Rx.timer(0, 50).pipe(
      Ro.map(() => location.pathname),
      Ro.distinctUntilChanged(),
      Ro.map((pathname: string) => pathname.split("/").filter((x) => !!x)),
      Ro.filter((route) => startsWith(route, virtualPath)),
      Ro.map((route) => route.slice(virtualPath.length))
    ),
    execute(path: string[]) {
      pushPath(path.join("/"));
    },
  };
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

        event.returnValue = false;
        return false;
      }
    }
  }
}

function pushPath(pathname: string) {
  let { pathname: old } = window.location;

  if (old + "/" === pathname) {
    console.log("replaceState", pathname);
    window.history.replaceState(null, null, pathname);
  } else if (old !== pathname) {
    window.history.pushState(null, null, pathname);
  } else {
    // console.error("same as ", pathname);
  }
}
