import classes from "./app.module.scss";
import { State, jsxFactory, useState } from "@xania/view";
import { createWebApp } from "../router/webapp";
import { HomeComponent } from "../home";
import { route } from "../router/route-resolver";
import * as matchers from "../router/matchers";
import { ToolBar } from "../layout/toolbar";
import { MDCDrawer } from "@material/drawer";
import { ReasultApp } from "../reasult";
import { CounterApp } from "../benchmark/counter";
import { PaletZuidApp } from "../palet-zuid";

const jsx = jsxFactory({ classes });

export function App() {
  const webApp = createWebApp([
    route(["reasult"], ReasultApp),
    route(["counter"], CounterApp),
    route(["palet-zuid"], PaletZuidApp),
    route(matchers.any, HomeComponent),
  ]);
  var state = useState(false);
  return (
    <>
      <div class="app__container">{webApp}</div>
      <ToolBar menuClick={(_) => state.update((open) => !open)} />
      <Drawer open={state} />
    </>
  );
}

interface DrawerProps {
  open: State<boolean>;
}

function Drawer(props: DrawerProps) {
  var open = props.open;
  const init = {
    render(dom: HTMLElement) {
      var drawer = MDCDrawer.attachTo(
        dom.parentNode.querySelector(".mdc-drawer")
      );
      drawer.listen("MDCDrawer:opened", function () {
        open.set(true);
      });
      drawer.listen("MDCDrawer:closed", function () {
        open.set(false);
      });

      open.subscribe({
        next(b) {
          drawer.open = b;
        },
      });
    },
  };
  return (
    <>
      <aside
        class="mdc-drawer mdc-drawer--modal"
        style="top: 0;"
        click={(_) => open.set(false)}
      >
        <div class="mdc-drawer__content">
          <nav class="mdc-list">
            <MainLink text="Home" url={"/"} icon="home" />
            <MainLink text="Invoices" url={"/invoices"} icon="euro_symbol" />
            <MainLink text="Menucard" url={"/menucard"} icon="restaurant" />
            <MainLink text="Mollie" url={"/mollie"} icon="money" />
            <a
              class="mdc-list-item"
              href="/reasult"
              aria-current="page"
              tabIndex={1}
            >
              Reasult
            </a>
          </nav>
        </div>
      </aside>
      <div class="mdc-drawer-scrim" click={(_) => open.set(false)}>
        {init}
      </div>
    </>
  );
}

interface MainLinkProps {
  text: string;
  url: string;
  icon: string;
  color?: string;
}
function MainLink(props: MainLinkProps) {
  return (
    // <li
    //   class="mdc-list-item mdc-list-item--with-one-line mdc-list-item--with-trailing-button mdc-ripple-surface"
    //   tabIndex={0}
    // >
    //   {MDCRipple}

    //   <span class="mdc-list-item__content">{o.value}</span>

    //   <button class="mdc-list-item__end mdc-icon-button material-icons">
    //     add
    //   </button>
    // </li>

    <a
      class="mdc-list-item mdc-list-item--with-one-line mdc-list-item--with-leading-icon mdc-ripple-surface router-link"
      href={props.url}
      aria-current="page"
      tabIndex={1}
    >
      <i
        class="material-icons mdc-list-item__start"
        style={props.color && "color: " + props.color}
        aria-hidden="true"
      >
        {props.icon}
      </i>
      <span class="mdc-list-item__content">{props.text}</span>
    </a>
  );
}
