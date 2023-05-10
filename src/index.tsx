import { Attrs, render } from "xania";
import "./main.css";
import { Route } from "xania/router";
import { Layout } from "./layout";
import { ComingSoon } from "./soon/coming-soon";

render(<App />, document.getElementById("app")!);

export function App() {
  return (
    <>
      <Attrs class="flex flex-col" />
      <Layout>
        <div class="border-box relative m-0 flex flex-auto flex-row overflow-auto bg-white p-0 align-middle dark:bg-gray-600">
          <Route>
            <ComingSoon />
          </Route>
        </div>
      </Layout>
    </>
  );
}

function LandingPage() {
  return "landing page";
}
