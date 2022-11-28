import { MDCRipple } from "@material/ripple";
import { jsxFactory } from "@xania/view";

const jsx = jsxFactory();

export interface ButtonProps<T> {
  icon: string;
  href?: string;
  click?: (e: JSX.EventContext<T, MouseEvent>) => void;
}
export function Button<T>(props: ButtonProps<T>) {
  return (
    <a
      click={props.click}
      href={props.href}
      data-mdc-ripple-is-unbounded
      class="router-link material-icons mdc-icon-button mdc-ripple-surface"
      aria-label="Options"
    >
      {MDCRipple}
      {props.icon}
    </a>
  );
}
