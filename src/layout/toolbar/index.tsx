import classes from "./toolbar.module.scss";
import { jsxFactory } from "@xania/view";
import { Button, ButtonProps } from "../button";

const jsx = jsxFactory({ classes });

interface ToolBarProps {
  menuClick: ButtonProps["click"];
}

export function ToolBar(props: ToolBarProps) {
  return (
    <div class="toolbar">
      <section class="toolbar__section">
        <Button click={props.menuClick} icon="menu" />
      </section>
      <section class="toolbar__section toolbar__section--align-end">
        <Button href="/" icon="search" />
      </section>
    </div>
  );
}
