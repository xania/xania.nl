import { render } from "@xania/view";
import * as jsx from "@xania/view";
import { RouterOutlet } from "@xania/mvc.js";
import { createBrowser, createRouter } from "@xania/mvc.js/router";

function App() {
  return (
    <>
      <Header />
      <Main />
    </>
  );
}

function Header() {
  return (
    <div class="header">
      <h1>Ibrahim ben Salah</h1>
    </div>
  );
}

function AdminComponent() {
  return <div>Admin component</div>;
}
function Main() {
  const browser = createBrowser([]);
  const router = createRouter(browser, browser.routes, [
    { path: ["admin"], component: AdminComponent },
  ]);
  return (
    <div class="main">
      <p>
        Software engineer with 20y+ handson experience in software development
      </p>
      <p>
        I am currently looking for a new projects working with .NET and or
        JavaScript frameworks
        <div>
          Contact:{" "}
          <a href="mailto:ibrahim.bensalah@xania.nl">
            ibrahim.bensalah@xania.nl
          </a>{" "}
          0641379989
        </div>
      </p>
      <section class="outline">
        Tools used for development of this page:
        <ul>
          <li>VS Code</li>
          <li>Html, Css</li>
          <li>NPM, vite and sass</li>
          <li>Git on Github</li>
          <li>GitHub Actions</li>
          <li>Azure Static Websites</li>
        </ul>
      </section>
      <RouterOutlet router={router} />
    </div>
  );
}

(<App />).render("#app");
