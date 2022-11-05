import * as Rx from "rxjs";
import * as Ro from "rxjs/operators";
import { Route, Router } from "../router";
import {
  createRouteResolver,
  RouteComponent,
  RouteInput,
  RouteResolution,
  RouteResolver,
} from "../route-resolver";
import { Path } from "../path";
import classes from "./outlet.module.scss";
import { RouteContext } from "../router-context";
import boxes from "../animations/boxes";

export interface OutletProps<TView> {
  routes: RouteInput<TView>[];
  router: Router;
}

type RenderTarget = HTMLElement;
type ViewBinding = {
  dispose(): void;
};

export function Outlet<TView>(props: OutletProps<TView>) {
  const { routes, router } = props;
  const rootResolve = createRouteResolver(routes);

  return {
    render(target: RenderTarget) {
      var rootPage = new Page(target, [], rootResolve);
      var sub = router.routes
        .pipe(
          Ro.map<Route, [Route, HTMLDivElement]>((route) => {
            const animation = boxes();
            const loader = document.createElement("div");
            loader.className = classes["loading"];
            loader.appendChild(animation);
            target.appendChild(loader);

            return [route, loader];
          }),
          Ro.switchMap(([route, loader]) => {
            return Rx.of<PageResolution>({
              route,
              page: rootPage,
              view: null,
            }).pipe(
              Ro.expand((pr) => pr.page.navigateTo(pr.route)),
              Ro.skip(1) /* skip root */,
              Ro.map<PageResolution, [PageResolution, HTMLDivElement]>(
                (res) => [res, loader]
              ),
              Ro.finalize(() => {
                setTimeout((_) => {
                  loader.remove();
                }, 400);
              })
            );
          }),
          Ro.map(([res]) => {
            const { page, view } = res;

            const context: ViewContext = {
              route: res.route,
            };

            page.bind(view, res.routeResolution, context);
          })
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

interface PageResolution {
  route: Route;
  view: any;
  page: Page;
  routeResolution?: RouteResolution;
}

class Page {
  private _binding: ViewBinding = null;
  private _next: Page;
  private _resolution: RouteResolution;
  private _view: any;
  private _container: HTMLElement;

  constructor(
    public target: RenderTarget,
    public basePath: Path,
    public resolveRoute: RouteResolver
  ) {
    const div = document.createElement("div");
    div.classList.add(classes["page-container"]);
    div.classList.add(classes["page-container--inactive"]);
    target.appendChild(div);

    this._container = div;
  }

  clear() {
    this.clearNext();
    this._binding?.dispose();
    this._binding = null;
    this._resolution = null;
  }

  clearNext() {
    if (this._next) {
      this._next.clear();
      this._next._container.remove();
      this._next = null;
    }
  }

  matchResolution(routeResolution: RouteResolution) {
    return (
      this._resolution &&
      matchPath(this._resolution.appliedPath, routeResolution.appliedPath)
    );
  }

  bind(view: any, routeResolution: RouteResolution, context: ViewContext) {
    const { _container } = this;
    this._view = view;

    if (this.matchResolution(routeResolution)) {
      return false;
    }

    this._resolution = routeResolution;

    if (this._binding) {
      const oldBinding = this._binding;
      this._binding = null;
      setTimeout(() => oldBinding.dispose(), 400);
    }

    if (view && view.render instanceof Function) {
      this._binding = view.render(_container, context);
      _container.classList.add(classes["page-container--loading"]);
      _container.classList.replace(
        classes["page-container--inactive"],
        classes["page-container--active"]
      );
      _container.scrollIntoView();
      setTimeout(function () {
        _container.classList.remove(classes["page-container--loading"]);
      }, 400);
    } else {
      this._binding = null;
      _container.classList.replace(
        classes["page-container--active"],
        classes["page-container--inactive"]
      );
    }

    return true;
  }

  resolve = async (route: Route) => {
    const { resolveRoute } = this;

    if (!resolveRoute) return;

    const nextResolution = this._next?._resolution;
    if (nextResolution) {
      if (matchPath(nextResolution.appliedPath, route.path)) {
        return nextResolution;
      }
    }

    return await resolveRoute(route.path);
  };

  nextPage(target: RenderTarget, basePath: Path, resolveView: RouteResolver) {
    if (this._next) return this._next;
    return (this._next = new Page(target, basePath, resolveView));
  }

  navigateTo = (route: Route) => {
    const { target, _next } = this;

    if (_next) {
      const nextResolution = _next?._resolution;
      if (nextResolution) {
        if (matchPath(nextResolution.appliedPath, route.path)) {
          const remainingPath = route.path.slice(
            nextResolution.appliedPath.length
          );
          const basePath = [...this.basePath, ...nextResolution.appliedPath];
          const res: PageResolution = {
            route: { path: remainingPath, trigger: route.trigger },
            page: this.nextPage(target, basePath, _next.resolveRoute),
            view: _next._view,
            routeResolution: nextResolution,
          };
          return Rx.of(res);
        }
      }
    }

    return new Rx.Observable<PageResolution>((observer) => {
      this.resolve(route).then(async (routeResolution) => {
        if (routeResolution) {
          const { _resolution } = this;
          const parentParams = _resolution?.params;

          const { view, routes } = await applyComponent(
            routeResolution.component,
            {
              params: parentParams
                ? { ...parentParams, ...routeResolution.params }
                : routeResolution.params,
              url: `/${this.basePath.join(
                "/"
              )}/${routeResolution.appliedPath.join("/")}`,
            }
          );

          const remainingPath = route.path.slice(
            routeResolution.appliedPath.length
          );
          const basePath = [...this.basePath, ...routeResolution.appliedPath];
          const resolveNext =
            routes instanceof Function ? routes : createRouteResolver(routes);
          const res: PageResolution = {
            route: { path: remainingPath, trigger: route.trigger },
            page: this.nextPage(target, basePath, resolveNext),
            view,
            routeResolution,
          };

          observer.next(res);
        } else {
          this.clearNext();
        }

        observer.complete();
      });
    });
  };

  createPage = (
    view: any,
    appliedPath: Path,
    resolveNext: RouteResolver<any>,
    route: Route
  ) => {
    const { target } = this;

    const remainingPath = route.path.slice(appliedPath.length);
    return {
      route: { path: remainingPath, trigger: route.trigger },
      page: this.nextPage(target, route.path, resolveNext),
      view,
    } as PageResolution;
  };
}

class EmptyResult {
  constructor(public route: Route, public resolveRoute: RouteResolver) {}
}

export interface ViewContext {
  route: Route;
}

class ViewResult<TView = any> {
  public next: ViewResult | EmptyResult;

  constructor(
    public view: TView,
    public appliedPath: Path,
    public resolveRoute: RouteResolver,
    public context: ViewContext
  ) {}

  matchPath(newPath: Path) {
    const { appliedPath } = this;
    if (appliedPath.length === 0) return true;

    for (let i = 0; i < appliedPath.length; i++) {
      if (appliedPath[i] !== newPath[i]) return false;
    }

    return true;
  }
}

class RouteResult {
  constructor(public route: Route, public resolveRoute: RouteResolver) {}
}

async function resolveNextRoute(
  prev: ViewResult | EmptyResult,
  route: Route,
  resolveRoute: RouteResolver
) {
  if (!(resolveRoute instanceof Function))
    return new EmptyResult(route, resolveRoute);
  // check if we can reuse prev view result
  if (prev instanceof ViewResult && prev.matchPath(route.path)) {
    const remainingPath = route.path.slice(prev.appliedPath.length);

    prev.next = await resolveNextRoute(
      prev.next,
      { path: remainingPath, trigger: route.trigger },
      prev.next.resolveRoute
    );
    return prev;
  }
  // nope!, path changed and need to resolve based on new path
  return new RouteResult(route, resolveRoute);
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

function matchPath(x: Path, y: Path) {
  if (x.length === 0) return true;

  for (let i = 0; i < x.length; i++) {
    if (y[i] !== x[i]) return false;
  }

  return true;
}

function pathEqual(x: Path, y: Path) {
  if (!x || !y) return false;
  if (x.length !== y.length) return false;
  for (let i = 0; i < x.length; i++) {
    if (x[i] !== y[i]) return false;
  }
  return true;
}

let _uid = 0;
let uid = () => {
  return ++_uid;
};

function applyComponent(
  fn: any,
  config: RouteContext
): Promise<RouteComponent> {
  try {
    var result = fn(config);
    if (result instanceof Promise) {
      return result.then(buildResult);
    } else {
      return Promise.resolve(buildResult(result));
    }
  } catch (e) {
    return Promise.resolve(Reflect.construct(fn, [config.params]));
  }

  function buildResult(result) {
    if (!result) return result;
    if (result instanceof Function)
      // typically when using dynamic imports
      return applyComponent(result, config);
    if ("render" in result) {
      return {
        view: result,
      };
    } else {
      return result;
    }
  }
}
