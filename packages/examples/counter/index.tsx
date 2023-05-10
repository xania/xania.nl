import { Page } from "../../../src/layout/page";
import { Title } from "../components/heading";
import { useState } from "xania";

export function App() {
  const count = useState(0);

  return (
    <>
      <Page class="flex-auto">
        <Title>Counter</Title>

        <div class="flex justify-center p-4 align-middle">
          <button
            class="rounded bg-yellow-500 px-4 py-2 font-bold"
            click={count.update((x) => x + 1)}
          >
            Count: {count}
          </button>
        </div>
      </Page>
    </>
  );
}
