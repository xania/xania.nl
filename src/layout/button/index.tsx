import { MDCRipple } from "@material/ripple";
import * as jsx from "@xania/view";

export interface ButtonProps {
  icon: string;
  href?: string;
  click?: (e: JSX.EventContext<MouseEvent>) => void;
}
export function Button(props: ButtonProps) {
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
