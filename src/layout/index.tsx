import { WebApp } from "xania/router";

export function Layout(props: { children: JSX.Children }) {
  return (
    <WebApp>
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
