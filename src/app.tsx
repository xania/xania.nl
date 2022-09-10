import * as jsx from "@xania/view";
import { render } from "@xania/view";
import { createBrowser } from "./router/browser-router";
import { Outlet } from "./router/outlet";
import { route } from "./router/view-resolver";

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
  return {
    view: <div>Admin component</div>,
    routes: [
      {
        match: ["b", "c"],
        view: <div>dafasdf</div>,
      },
    ],
  };
}

function Main() {
  return (
    <div class="main">
      <p>
        Software engineer with 20y+ handson experience in software development
      </p>
      <p>
        I am currently looking for a new projects working with .NET and or
        JavaScript frameworks
        <div>
          Contact:
          <a href="mailto:ibrahim.bensalah@xania.nl">
            ibrahim.bensalah@xania.nl
          </a>
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
      <Nav />
      <Outlet
        router={createBrowser([])}
        routes={[route(regex, AdminComponent)]}
      />
    </div>
  );
}

function regex(path: string[]) {
  return Promise.resolve({
    length: 1,
  });
}

render(<App />, "#app");

function Nav() {
  return (
    <div>
      <div>Hello World</div>
      <div>
        <a href="/" class="router-link">
          Home
        </a>
      </div>
      <div>
        <a href="/a" class="router-link">
          /a
        </a>
      </div>
      <div>
        <a href="/a/b" class="router-link">
          /a/b
        </a>
      </div>
      <div>
        <a href="/a/b/c" class="router-link">
          /a/b/c
        </a>
      </div>
    </div>
  );
}
