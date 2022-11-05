import { MDCTextField } from "@material/textfield";
import { jsxFactory } from "@xania/view";
import { Field, isField } from "../helpers";
import classes from "./text-field.module.scss";
import "./text-field.scss";

export interface TextFieldProps {
  label: string;
  value?: string | Field;
  hint?: string;
  sideLabel?: string;
}
const jsx = jsxFactory({ classes });

export function TextField(props: TextFieldProps, children) {
  const inputAttrs = {};
  if (isField(props.value)) {
    const field = props.value;
    inputAttrs["value"] = field.valueOf();
    inputAttrs["change"] = function (evt) {
      field.update(evt.event.target.value);
    };
  } else {
    inputAttrs["value"] = props.value;
    inputAttrs["disabled"] = true;
  }

  const id = new Date().getTime();
  return (
    <>
      <label class="mdc-text-field mdc-text-field--filled">
        <span class="mdc-text-field__ripple"></span>
        <span class="mdc-floating-label" id={id}>
          {props.label}
        </span>
        <input
          {...inputAttrs}
          type="text"
          class="mdc-text-field__input"
          aria-labelledby={id}
        />
        <span class="mdc-line-ripple"></span>
        {props.sideLabel && (
          <span class="side-label mdc-elevation--z4">{props.sideLabel}</span>
        )}
        {MDCTextField}
      </label>
      <HelperText text={props.hint} />
    </>
  );

  interface HelperTextProps {
    text: string;
  }
  function HelperText(props: HelperTextProps) {
    return (
      props.text && (
        <div class="mdc-text-field-helper-line">
          <p
            class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg"
            id="text-field-filled-helper-text"
          >
            {props.text}
          </p>
        </div>
      )
    );
  }

  // return (
  //   <div class="mdc-text-field">
  //     <label for="text-field-hero-input" class="mdc-floating-label">
  //       {props.label}
  //     </label>
  //     <input
  //       class="mdc-text-field__input"
  //       id="text-field-hero-input"
  //       value={props.value}
  //     />
  //     <div class="mdc-line-ripple"></div>
  //     {MDCTextField}
  //   </div>
  // );
}
