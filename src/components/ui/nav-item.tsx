import { Attrs } from "xania";

const navItem = Attrs({
  class:
    "flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
});

interface NavItemProps {
  children: JSX.Children;
}
export function NavItem(props: NavItemProps) {
  return (
    <li>
      <a class="flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
        {props.children}
      </a>
    </li>
  );
}
