import { jsxFactory } from "@xania/view";
import classes from "./header.module.scss";
import { MDCRipple } from "@material/ripple";

const jsx = jsxFactory({ classes });

interface PageHeaderProps {
  title?: string;
  backUrl?: string;
}
export function PageHeader(props: PageHeaderProps) {
  const { backUrl = null, title = null } = props || {};
  return (
    <header class="header">
      <section
        class={[
          "mdc-elevation--z4",
          "header__section--align-start",
          "header__section",
        ]}
      >
        <If value={backUrl}>
          <Back />
        </If>

        <If value={title}>
          <span class={["header__title", "mdc-typography--headline6"]}>
            {title}
          </span>
        </If>
      </section>
    </header>
  );
}

function Back() {
  return (
    <a
      click={(_) => window.history.back()}
      data-mdc-ripple-is-unbounded
      class="router-link material-icons mdc-icon-button mdc-ripple-surface"
      aria-label="Options"
    >
      {MDCRipple}arrow_backward
    </a>
  );
}

function If(props: { value: any }, children) {
  if (!!props.value) return children;
}
