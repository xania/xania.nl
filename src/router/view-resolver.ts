import { Path } from "./path";
import { compilePathTemplate, PathTemplate } from "./path-template";

export function createViewResolver<TView>(
  routes: RouteInput<TView>[]
): ViewResolver<TView> {
  if (isArrayEmpty(routes)) {
    return null;
  }

  const compiled = compile(routes);
  if (isArrayEmpty(compiled)) {
    return (remainingPath) => {
      return Promise.resolve<ViewResolution<TView>>({
        appliedPath: remainingPath,
      });
    };
  }

  return resolve;

  function resolve(remainingPath: string[]) {
    for (const route of compiled) {
      const segment = route.match(remainingPath);
      if (segment) {
        if (segment instanceof Promise) {
          return segment.then(buildResolution);
        } else {
          return buildResolution(segment);
        }

        async function buildResolution(segment: RouteSegment) {
          const appliedPath = remainingPath.slice(0, segment.length);

          const { view, routes } = await applyComponent(route.component);

          return {
            appliedPath,
            view,
            params: segment.params,
            resolve:
              routes instanceof Function ? routes : createViewResolver(routes),
          } as ViewResolution<TView>;
        }
      }
    }
    const notFound: NotFound = {
      appliedPath: remainingPath,
    };
    return Promise.resolve(notFound);
  }

  function compile(routes: RouteInput<TView>[]): Route<TView>[] {
    const results: Route<TView>[] = [];
    if (routes instanceof Array) {
      for (const route of routes) {
        const { match, component } = route;

        results.push({
          match: match instanceof Function ? match : pathMatcher(match),
          component,
        });
      }
    }
    return results;
  }
}

function pathMatcher(pathTemplate: PathTemplate) {
  const matchers = compilePathTemplate(pathTemplate);
  return (path: Path) => {
    const { length } = pathTemplate;
    if ((length === 0 && path.length > 0) || length > path.length) {
      return null;
    }
    const params = {};
    for (var i = 0; i < length; i++) {
      const match = matchers[i](path[i]);
      if (!match) {
        return null;
      } else if (match !== true) {
        Object.assign(params, match);
      }
    }
    return {
      length: length,
      params,
    };
  };
}

interface RouteParams {
  [key: string]: any;
}

interface RouteSegment {
  length: number;
  params?: RouteParams;
}

export type ViewResolver<TView = any> = (
  route: string[]
) => Promise<ViewResolution<TView>>;

type ViewResolution<TView> = Resolved<TView> | NotFound;
interface Resolved<TView> {
  appliedPath: string[];
  params?: RouteParams;
  view: TView | null;
  resolve?: ViewResolver<TView>;
}

interface NotFound {
  appliedPath: string[];
}

export interface RouteInput<TView> {
  match: PathTemplate | Route<TView>["match"];
  component: ComponentInput<TView>;
}

interface Route<TView> {
  match(path: Path): RouteSegment | Promise<RouteSegment>;
  component: ComponentInput<TView>;
}

function isArrayEmpty(arr: any[]) {
  return !(arr instanceof Array) || arr.length === 0;
}

// function memoize<TF extends (...args: any[]) => any>(fn: TF) {
//   let result = null;
//   let invoked = false;
//   return function (...args: Parameters<TF>): ReturnType<TF> {
//     if (invoked) {
//       return result;
//     }
//     invoked = true;
//     return (result = fn());
//   };
// }

export interface RouteComponent<TView = any> {
  view: TView;
  routes?: RouteInput<TView>[] | ViewResolver<TView>;
}

type ComponentFunc<TView> = () => RouteComponent<TView>;
type ComponentInput<TView> =
  | ComponentFunc<TView>
  | { prototype: RouteComponent<TView> };

export function route<TView>(
  match: RouteInput<TView>["match"],
  component: RouteInput<TView>["component"]
): RouteInput<TView> {
  return {
    match,
    component,
  };
}

function applyComponent(fn: any) {
  try {
    var result = fn();
    if (result instanceof Promise) {
      return result.then(buildResult);
    } else {
      return Promise.resolve(buildResult(result));
    }
  } catch (e) {
    return Promise.resolve(Reflect.construct(fn, []));
  }

  function buildResult(result) {
    if (result && "render" in result) {
      return {
        view: result,
      };
    } else {
      return result;
    }
  }
}
