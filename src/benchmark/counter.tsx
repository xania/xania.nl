import { jsxFactory, useState } from "@xania/view";

const jsx = jsxFactory({});

export function CounterApp() {
  const counter = useState(0);

  function increment() {
    counter.update((x) => x + 1);
  }

  return {
    get view() {
      return (
        <div>
          <button click={increment}>increment</button>
          {counter}
        </div>
      );
    },
  };
}
