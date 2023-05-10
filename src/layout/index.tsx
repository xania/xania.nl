import { Attrs, useState as state } from "xania";
import { WebApp } from "xania/router";

export function Layout(props: { children: JSX.Children }) {
  const drawerOpen = state(false);

  return (
    <WebApp
      navigate={() =>
        drawerOpen.update(!location.pathname || location.pathname === "/")
      }
    >
      <div
        click={drawerOpen.update(false)}
        drawer-backdrop=""
        class={[
          "fixed inset-0 z-30 bg-gray-900 bg-opacity-50 ease-linear dark:bg-opacity-80",
          drawerOpen.when(false, "hidden", null),
        ]}
      ></div>

      <AppContainer>{props.children}</AppContainer>
    </WebApp>
  );
}

function AppContainer(props: { children: JSX.Children }) {
  return (
    <div class="border-box relative m-0 flex flex-auto flex-row overflow-auto bg-gray-100 p-0 align-middle dark:bg-gray-600">
      {props.children}
    </div>
  );
}
