import { jsxFactory, useState } from "@xania/view";
import { delay } from "../helpers";
import { IconButton } from ".";
import classes from "./toggle.module.scss";

interface ToggleButtonProps {
  on: boolean;
  click: (state: boolean) => Promise<void>;
}

const jsx = jsxFactory({ classes });

export function ToggleButton(props: ToggleButtonProps) {
  const toggle_on = "toggle_on";
  const toggle_off = "toggle_off";
  const initial = props.on ? toggle_on : toggle_off;
  const toggleState = useState(initial);
  const classState = useState(classes[initial]);

  return (
    <button
      class={[classState]}
      click={() => {
        const prev = toggleState.current;
        const next = prev.includes(toggle_off) ? toggle_on : toggle_off;
        toggleState.update((_) => "sync");
        classState.update((_) => classes["toggle_loading"]);
        delay(props.click(prev.includes(toggle_on)), 1000).then((_) => {
          toggleState.update((_) => next);
          classState.update((_) => classes[toggleState.current]);
        });
      }}
    >
      <IconButton>
        <span class="material-icons">{toggleState}</span>
      </IconButton>
    </button>
  );
}
