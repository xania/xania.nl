import "./icon-button.scss";
import { Attrs, Css, jsxFactory } from "@xania/view";
import { MDCRipple } from "@material/ripple";

const jsx = jsxFactory();

interface IconButtonProps {}
export function IconButton(props: IconButtonProps, children) {
  return (
    <>
      <Css value={"mdc-icon-button"} />
      <Attrs data-mdc-ripple-is-unbounded="true" />
      <div class="mdc-icon-button__ripple"></div>
      <span class="mdc-icon-button__focus-ring"></span>
      {children}
      {MDCRipple}
    </>
  );
}
