import classes from "./css.module.scss";
import { jsxFactory, view } from "@xania/view/lib/jsx2";
import { RenderTarget, State, useState } from "@xania/view";
import { delay } from "../../layout/helpers";

const jsx = jsxFactory({ classes });

export function SectionDemo(props: { title: string }, children) {
  return (
    <section class="demo-section">
      <h3>{props.title}</h3>
      {view(children)}
    </section>
  );
}

export function HelloWorld() {
  return <span class="element">hello world!</span>;
}

export function NestedElements() {
  return (
    <span class="element">
      <span class="element">nested element!</span>
    </span>
  );
}

export function NestedTextAndElements() {
  return (
    <span class="element">
      text before<span class="element">nested element!</span>
      text after
    </span>
  );
}

export function MultipleRootElementsDemo() {
  /**
   * Alternatively u can just return an array of the root elements
   */
  return (
    <>
      <span class="element">root element 1</span>
      <span class="element">root element 2</span>
    </>
  );
}

export function CssModuleDemo() {
  const jsx = jsxFactory({ classes });

  return <span class="element dark-theme">css modules in action</span>;
}

export function DelayedTextContent(props: { value: Promise<string> }) {
  return <span class="element">{props.value}</span>;
}

export function UseStateDemo() {
  const count: State<number> = useState(0);

  return (
    <div class="element">
      <div>Count: {count}</div>
      <button class="mdc-button" click={count.reduce((e) => e + 1)}>
        <span>Increment</span>
      </button>
    </div>
  );
}

export function TimerDemo() {
  const time: State<Date> = useState(new Date());

  /**
   * the mount/unmount handlers are registered right with the resulting view
   * instead of having to use global context like most other jsx implementations
   */
  return (
    <div class="element">
      {useInterval(time.reduce(() => new Date()))}
      <div>Current Time: {time.map((t) => t.toLocaleTimeString())}</div>
    </div>
  );

  function useInterval(callback, ms: number = 1000) {
    return {
      subscribe() {
        const timer = setInterval(callback, ms);
        return {
          unsubscribe() {
            clearInterval(timer);
          },
        };
      },
    };
  }
}

export function CustomRenderDemo() {
  return {
    render(target: RenderTarget) {
      const div = document.createElement("div");
      div.className = "element";
      div.innerHTML =
        "This element is created with <br />custom dom operations";

      target.appendChild(div);

      return {
        dispose() {
          div.remove();
        },
      };
    },
  };
}
