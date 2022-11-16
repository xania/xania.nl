import classes from "./css.module.scss";
import { jsxFactory, view } from "@xania/view/lib/jsx2";
import { RenderTarget, State, useState } from "@xania/view";
import { useInterval } from "./use-interval";
import { delay } from "../../layout/helpers";
import * as Rx from "rxjs";
import * as Ro from "rxjs/operators";

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
  return (
    <>
      <span class="element">simple root element 1</span>
      <span class={delay("element")}>
        Element suspended untill attribute promise is resolved
      </span>
      {useInterval(() => (
        <span class="element slide-in">{new Date().toLocaleTimeString()}</span>
      ))}
      {Rx.timer(0, 1500).pipe(
        Ro.scan((p, next, i) => next + 1, 0),
        Ro.map((idx) => (
          <span class="element slide-in">I am an rxjs observable {idx}</span>
        ))
      )}
    </>
  );
}

export function FormElementsDemo() {
  const firstName = useState("");
  const lastName = useState("");

  return (
    <>
      <input
        placeholder="First name"
        type="text"
        keyup={(e: any) => firstName.update(e.node.value)}
      />
      <input
        placeholder="Last name"
        type="text"
        keyup={(e: any) => lastName.update(e.node.value)}
      />
      <div>
        {firstName} {lastName}
      </div>
    </>
  );
}

export function CssModuleDemo() {
  const jsx = jsxFactory({ classes });

  return <span class="element dark-theme">css modules in action</span>;
}

export function DelayedTextContent(props: { value: Promise<string> }) {
  return <span class="element slide-in">{props.value}</span>;
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
  return (
    <div class="element">
      <div>
        Current Time: {useInterval(() => new Date().toLocaleTimeString())}
      </div>
    </div>
  );
}

export function CustomRenderDemo() {
  return {
    render(target: RenderTarget) {
      const div = document.createElement("div");
      div.className = "element";
      div.innerHTML = "This dom element is created using <br />custom code";

      target.appendChild(div);

      return {
        dispose() {
          div.remove();
        },
      };
    },
  };
}

export function ClassListDemo() {
  const theme = useInterval((prev: string = "dark-theme") =>
    prev === "light-theme" ? "dark-theme" : "light-theme"
  );
  return <div class={[theme, "element"]}>Toggle theme class each second</div>;
}
