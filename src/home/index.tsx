import { Css, jsxFactory } from "@xania/view";
import { Page, PageContent } from "../layout/page";
import { TextField } from "../layout/text-field";
import { RouteComponent } from "../router/route-resolver";
import { routes } from "../routes";
import classes from "./home.module.scss";
// import { MDCTextField } from "@material/textfield";

const jsx = jsxFactory({ classes });

export class HomeComponent implements RouteComponent {
  get view() {
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
          <TextField label="Zoek in de buurt..." />
          <img src="/home/intro.jpg" style="width: 70%;" />
        </PageContent>
      </Page>
    );
  }
  routes? = routes;
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
