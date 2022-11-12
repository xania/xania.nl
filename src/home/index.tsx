import { Css, jsxFactory } from "@xania/view";
import { Page, PageContent } from "../layout/page";
import { TextField } from "../layout/text-field";
import classes from "./home.module.scss";

const jsx = jsxFactory({ classes });

export function HomeComponent() {
  return (
    <Page>
      <PageContent>
        <Css value={classes["home"]} />
        {/* <div class="mdc-text-field">
            <input class="mdc-text-field__input" id="text-field-hero-input" />
            <div class="mdc-line-ripple"></div>
            <label for="text-field-hero-input" class="mdc-floating-label">
              Name
            </label>
            {MDCTextField}
          </div> */}
        <a href="/" class="mdc-button button-button router-link">
          Home
        </a>
        <a class="mdc-button button-button router-link" href="/reasult">
          processes
        </a>
        <a href="/settings" class="mdc-button button-button router-link">
          Settings
        </a>
        <a href="/hackernews" class="mdc-button button-button router-link">
          HackerNews
        </a>
        <a href="/invoices" class="mdc-button button-button router-link">
          Invoices
        </a>
      </PageContent>
    </Page>
  );
}

function Info() {
  return (
    <div>
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
