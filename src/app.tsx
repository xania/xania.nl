import { render } from "@xania/view";
import * as jsx from "@xania/view";

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

render(<App />, "#app");
