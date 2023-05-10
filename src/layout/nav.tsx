import { Attrs, useState } from "xania";
import { Link } from "xania/router";
import { LayoutProps } from "./props";

export function Navigation(props: LayoutProps) {
  return (
    <nav class="fixed top-0 z-50 w-full bg-white dark:border-gray-700 dark:bg-gray-900">
      <div class="px-3 py-3 lg:px-5 lg:pl-3">
        <div class="flex justify-between">
          <div class="flex justify-start">
            <button
              click={props.drawerOpen.update((x) => !x)}
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              class="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"
            >
              <span class="sr-only">Open sidebar</span>
              <svg
                class="h-6 w-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
            <Logo />
          </div>
          <div class="flex items-center">
            <DarkModeButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

function DarkModeButton() {
  const init =
    localStorage.getItem("color-theme") === "dark" ||
    (!("color-theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (init) {
    document.documentElement.classList.add("dark");
  }

  const dark = useState(init);
  return (
    <button
      id="theme-toggle"
      data-tooltip-target="tooltip-toggle"
      type="button"
      class="rounded-full  p-1 text-gray-600 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:text-gray-300 "
      click={dark.update(toggle)}
    >
      <Attrs class={dark} />
      <svg
        aria-hidden="true"
        class="h-5 w-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z">
          <Attrs class={dark.when(true, "hidden", null)} />
        </path>
        <path
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
          fill-rule="evenodd"
          clip-rule="evenodd"
        >
          <Attrs class={dark.when(false, "hidden", null)} />
        </path>
      </svg>
      <span class="sr-only">Toggle dark mode</span>
    </button>
  );

  function toggle(b: boolean) {
    if (b) {
      document.documentElement.classList.remove("dark");
      localStorage.removeItem("color-theme");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }

    return !b;
  }
}

function Logo() {
  return (
    <a class="ml-2 flex md:mr-24">
      <Link to="" />
      <svg
        class="mr-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="1.147 44.46 52.153 40.797"
        width={47.527}
        height={36.591}
      >
        <rect
          x="30.018"
          y="56.517"
          width="20.495"
          height="20.495"
          style="stroke: none; fill: rgb(70, 100, 160);"
        ></rect>
        <rect
          class="fill-black dark:fill-gray-100"
          x="18.599"
          y="72.62"
          width="8.784"
          height="8.784"
        ></rect>
        <polygon
          style="stroke: none; fill: rgb(0, 120, 160);"
          points="11.865 47.733 27.383 47.733 27.383 69.692 4.545 69.692 4.545 53.882"
        ></polygon>
      </svg>
      <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white sm:text-2xl">
        Xania
      </span>
    </a>
  );
}
