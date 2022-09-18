import * as jsx from "@xania/view";
import {
  RouteComponent,
  RouteInput,
  ViewResolver,
} from "../router/view-resolver";

export class HomeComponent implements RouteComponent {
  get view() {
    return (
      <>
        <Header />
        <Nav />
        <Main />
      </>
    );
  }
  routes?: ViewResolver<any> | RouteInput<any>[];
}

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
        <a href="/123" class="router-link">
          /a
        </a>
      </div>
      <div>
        <a href="/invoices" class="router-link">
          invoices
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

function Header() {
  return (
    <div class="header">
      <h1>Ibrahim ben Salah</h1>
    </div>
  );
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
    </div>
  );
}
