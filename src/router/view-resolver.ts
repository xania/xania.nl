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
        const { view } = route;
        if (segment instanceof Promise) {
          return segment.then(buildResolution);
        } else {
          return Promise.resolve(buildResolution(segment));
        }

        function buildResolution(segment: RouteSegment) {
          const appliedPath = remainingPath.slice(0, segment.length);
          return {
            appliedPath,
            view,
            params: segment.params,
            resolve: route.resolve,
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
    if (Array.isArray(routes)) {
      for (const route of routes) {
        const { match, routes, view } = route;

        results.push({
          match: match instanceof Function ? match : pathMatcher(match),
          resolve:
            routes instanceof Function ? routes : createViewResolver(routes),
          view,
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
  view?: TView;
  routes?: ViewResolver<TView> | RouteInput<TView>[];
}

interface Route<TView> {
  match(path: Path): RouteSegment | Promise<RouteSegment>;
  view?: TView;
  resolve?: ViewResolver<TView>;
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

interface RouteComponent<TView> {
  view: TView;
  routes?: RouteInput<TView>["routes"];
}

export function route<TView>(
  match: RouteInput<TView>["match"],
  component: () => RouteComponent<TView>
) {
  return {
    match,
    ...component(),
  };
}
