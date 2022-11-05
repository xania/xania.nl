import { MDCSelect } from "@material/select";
import { Attrs, Css, jsxFactory } from "@xania/view";
import { Field, isField } from "../helpers";
import "./select.scss";

export interface SelectProps {
  label: string;
  value?: string | Field;
}

const jsx = jsxFactory({});
export function Select(props: SelectProps, children) {
  const id = "select-" + new Date().getTime();

  const init = {
    attachTo(target: HTMLElement) {
      const select = MDCSelect.attachTo(target);

      const { value } = props;
      if (value) {
        if (isField(value)) {
          select.value = value.valueOf();
          select.listen("MDCSelect:change", (evt) => {
            value.update(select.value);
          });
        } else {
          select.value = value;
        }
      }
    },
  };

  return (
    <div class="mdc-select mdc-select--filled">
      <div
        class="mdc-select__anchor"
        role="button"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-labelledby={`${id} demo-selected-text`}
      >
        <span class="mdc-select__ripple"></span>
        <span id={id} class="mdc-floating-label">
          {props.label}
        </span>
        <span class="mdc-select__selected-text-container">
          <span
            id="demo-selected-text"
            class="mdc-select__selected-text"
          ></span>
        </span>
        <span class="mdc-select__dropdown-icon material-icons">
          arrow_drop_down
        </span>
        <span class="mdc-line-ripple"></span>
      </div>

      <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">
        <ul class="mdc-list" role="listbox" aria-label="Food picker listbox">
          {children}
        </ul>
      </div>
      {init}
    </div>
  );
}

interface SelectOptionProps {
  selected?: boolean;
  disabled?: boolean;
  value: string;
  label?: string;
}
export function SelectOption(props: SelectOptionProps) {
  const attrs = { role: "option", ["data-value"]: props.value };

  if (props.disabled) {
    attrs["class"] = "mdc-list-item--disabled";
    attrs["aria-disabled"] = "true";
  }

  if (props.selected) {
    attrs["aria-selected"] = "true";
  }

  return (
    <>
      {props.selected ? <Css value="mdc-list-item--selected" /> : null}
      <Css value="mdc-list-item" />

      <Attrs {...attrs} />
      <span class="mdc-list-item__ripple"></span>
      <span class="mdc-list-item__content mdc-list-item__primary-text">
        {props.label ?? props.value}
      </span>
    </>
  );
}
