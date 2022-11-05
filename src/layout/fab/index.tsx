import { Attrs, Css, jsxFactory } from "@xania/view";
import { MDCRipple } from "@material/ripple";
import "./fab.scss";

const jsx = jsxFactory({});

export interface FabProps {
  icon: string;
}

export function Fab(props: FabProps) {
  return (
    <>
      <Css value="mdc-fab" />
      <Attrs aria-label={props.icon} />
      <div class="mdc-fab__ripple"></div>
      <span class="mdc-fab__icon material-icons">{props.icon}</span>
      {MDCRipple}
    </>
  );
}
