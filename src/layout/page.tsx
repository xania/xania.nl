﻿import classes from "./page.module.scss";

import { AnchorNode, Attachable, Attrs } from "xania";
import { Link, RouteTrigger, useRouteContext } from "xania/router";
import { Feedback } from "~/components/feedback";

interface PageProps {
  class?: string;
  children: JSX.Children;
  trigger?: RouteTrigger;
  title?: string;
  // scrollIntoView?: boolean;
}
export function Page(props: PageProps) {
  const routeContext = useRouteContext();

  return (
    <div class="box-border h-full last:flex-1 max-sm:fixed max-sm:left-0 max-sm:w-full sm:py-4 sm:pr-4  sm:first:pl-4">
      <Attrs class={props.class} />
      <Feedback />
      <Attrs
        class={routeContext.transition.map((b) => classes[`page--${b}`])}
      />
      <div class="relative box-border h-full max-h-[99.9%] overflow-y-auto  overflow-x-hidden border-2 border-solid border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-700">
        {props.children}
      </div>

      {scrollIntoView()}
    </div>
  );
}

function scrollIntoView() {
  return {
    attachTo(element) {
      if (element instanceof AnchorNode) {
        element.anchorNode.scrollIntoView();
      } else {
        element.scrollIntoView({ block: "end" });
      }
    },
  } satisfies Attachable;
}

// function iOS() {
//   return (
//     [
//       "iPad Simulator",
//       "iPhone Simulator",
//       "iPod Simulator",
//       "iPad",
//       "iPhone",
//       "iPod",
//     ].includes(navigator.platform) ||
//     // iPad on iOS 13 detection
//     (navigator.userAgent.includes("Mac") && "ontouchend" in document)
//   );
// }
