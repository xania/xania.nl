import classes from "./admin.module.scss";
import { State, jsxFactory, useState } from "@xania/view";
import { ToolBar } from "../layout/toolbar";
import { MDCDrawer } from "@material/drawer";
import { createBrowser } from "../router/browser-router";
import { Outlet } from "../router/outlet";
import { routes } from "../routes";
import { HomeComponent } from "../home";

const jsx = jsxFactory({ classes });

export function AdminApp() {
  const router = createBrowser([]);
  const webApp = Outlet({
    router,
    routes,
    rootView: <HomeComponent />,
  });
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
        open.update(true);
      });
      drawer.listen("MDCDrawer:closed", function () {
        open.update(false);
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
        click={(_) => open.update(false)}
      >
        <div class="mdc-drawer__content">
          <nav class="mdc-list">
            <MainLink text="Home" url={"/"} icon="home" />
            <MainLink text="Invoices" url={"/invoices"} icon="euro_symbol" />
            <MainLink text="Menucard" url={"/menucard"} icon="restaurant" />
            <MainLink text="Mollie" url={"/mollie"} icon="money" />
            <MainLink text="Counter" url={"/counter"} icon="money" />
            <MainLink text="Reasult" url={"/reasult"} icon="interprise" />
          </nav>
        </div>
      </aside>
      <div class="mdc-drawer-scrim" click={(_) => open.update(false)}>
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
