import classes from "./page.module.scss";
import { jsxFactory } from "@xania/view";
import { RenderTarget } from "@xania/view";
import { ViewContext } from "../../router/outlet";
import { RouteTrigger } from "../../router/router";
console.log(classes);

const match = /(?<d>\d+(\.\d+)?)s/.exec(classes["animationDuration"]);
const duration = parseFloat(match[1]) * 1000;
const jsx = jsxFactory({ classes });

export function Page(opts, children) {
  return <div class="page">{children}</div>;
  //   return {
  //     render(target: RenderTarget, context: ViewContext) {
  //       const tpl = <div class="page page--toolbar-fix">{children}</div>;

  //       const standalone =
  //         !iOS() || window.matchMedia("(display-mode: standalone)").matches;

  //       const binding = tpl.render(target);

  //       const shouldSlideIn =
  //         standalone || context.route.trigger == RouteTrigger.Click;

  //       if (shouldSlideIn) {
  //         for (var elt of binding.elements) {
  //           elt.classList.add(classes["slide-in"]);
  //         }
  //       }

  //       setTimeout(() => {
  //         for (var elt of binding.elements) {
  //           elt.classList.remove(classes["slide-in"]);
  //           // elt.classList.add(classes["slide-away"]);
  //         }
  //       }, duration);

  //       return {
  //         dispose(trigger: RouteTrigger) {
  //           const shouldSlideOut = standalone || trigger == RouteTrigger.Click;

  //           if (shouldSlideOut) {
  //             for (var elt of binding.elements) {
  //               elt.classList.add(classes["slide-out"]);
  //             }
  //             setTimeout(function () {
  //               binding.dispose();
  //             }, duration);
  //           } else {
  //             binding.dispose();
  //           }
  //         },
  //       };
  //     },
  //   };
  // }
}

export function PageContent(_, children) {
  return <main class={[classes["page__content"]]}>{children}</main>;
}

function iOS() {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}
