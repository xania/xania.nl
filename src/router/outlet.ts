import * as Ro from "rxjs/operators";
import { RenderTarget } from "@xania/view";
import { Router } from "./router";
import { createViewResolver, RouteInput, ViewResolver } from "./view-resolver";
import { Path } from "./path";

interface OutletProps<TView> {
  routes: RouteInput<TView>[];
  basePath?: Path;
  router: Router;
}

export function Outlet<TView>(props: OutletProps<TView>) {
  const { routes, basePath: basePath = [], router } = props;
  const rootResolve = createViewResolver(routes);

  return {
    render(target: RenderTarget) {
      // LinkListener().render(target as any);
      var sub = router.routes
        .pipe(
          Ro.mergeScan<Path, ViewResult | EmptyResult>(
            (prev, path) => resolveRoute(prev, path, rootResolve),
            null
          ),
          Ro.scan((cache, next) => {
            let x = next;

            let i = 0;
            while (x instanceof ViewResult) {
              const { view } = x;
              const entry = cache[i];
              if (entry?.view !== view) {
                cache[i] = { view, binding: view.render(target) };
              }
              x = x.next;
              i++;
            }

            while (i < cache.length) {
              const entry = cache.pop();
              entry.binding.dispose();
            }

            return cache;
          }, [])
        )
        .subscribe();

      return {
        dispose() {
          sub.unsubscribe();
        },
      };
    },
  };
}

class EmptyResult {
  constructor(public appliedPath: Path, public resolveView: ViewResolver) {}
}

class ViewResult<TView = any> {
  public next: ViewResult | EmptyResult;

  constructor(
    public view: TView,
    public appliedPath: Path,
    public resolveView: ViewResolver
  ) {}
}

async function resolveRoute(
  prev: ViewResult | EmptyResult,
  path: Path,
  resolveView: ViewResolver
) {
  if (path.length === 0 || !(resolveView instanceof Function))
    return new EmptyResult(path, resolveView);
  // check if we can reuse prev view result
  if (prev instanceof ViewResult && matchPath(prev.appliedPath, path)) {
    const remainingPath = path.slice(prev.appliedPath.length);
    prev.next = await resolveRoute(
      prev.next,
      remainingPath,
      prev.next.resolveView
    );
    return prev;
  }
  // nope!, path changed and need to resolve based on new path
  const resolution = await resolveView(path);
  if ("view" in resolution) {
    const { appliedPath, view, params, resolve: resolveNext } = resolution;
    var newViewResult = new ViewResult(view, appliedPath, resolveView);
    const remainingPath = path.slice(appliedPath.length);
    if (remainingPath.length > 0) {
      if (resolveNext instanceof Function)
        newViewResult.next = await resolveRoute(
          newViewResult.next,
          remainingPath,
          resolveNext
        );
      else {
        newViewResult.next = new EmptyResult([], resolveNext);
      }
    } else {
      newViewResult.next = new EmptyResult([], resolveNext);
    }
    return newViewResult;
  } else {
    return new EmptyResult(path, resolveView);
  }
}

function matchPath(path: Path, newPath: Path) {
  for (let i = 0; i < path.length; i++) {
    if (path[i] !== newPath[i]) return false;
  }

  return true;
}

function length(viewResult: ViewResult | EmptyResult) {
  if (!viewResult) return 0;
  if (viewResult instanceof EmptyResult) return 1;
  return 1 + length(viewResult.next);
}

function toArray(viewResult: ViewResult | EmptyResult) {
  if (!viewResult) return [];
  if (viewResult instanceof EmptyResult) return [];
  return [viewResult.view, ...toArray(viewResult.next)];
}
