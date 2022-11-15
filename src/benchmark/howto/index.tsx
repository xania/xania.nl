import { jsxFactory, RenderTarget } from "@xania/view";
import { delay } from "../../layout/helpers";
import { Page, PageContent } from "../../layout/page";
import {
  DelayedTextContent,
  CssModuleDemo,
  HelloWorld,
  MultipleRootElementsDemo,
  NestedElements,
  NestedTextAndElements,
  SectionDemo,
  TimerDemo,
  UseStateDemo,
  CustomRenderDemo,
} from "./examples";
import "./style.scss";
import classes from "./css.module.scss";

const jsx = jsxFactory({ classes });

export function HowtoApp() {
  return (
    <Page>
      <PageContent>
        <SectionDemo title="Simple element with text content">
          <HelloWorld />
        </SectionDemo>
        <SectionDemo title="Nested elements">
          <NestedElements />
        </SectionDemo>
        <SectionDemo title="Nested text and elements">
          <NestedTextAndElements />
        </SectionDemo>
        <SectionDemo title="Multiple roots">
          <MultipleRootElementsDemo />
        </SectionDemo>
        <SectionDemo title="Css module support">
          <CssModuleDemo />
        </SectionDemo>
        <SectionDemo title="Async text content">
          <DelayedTextContent value={delay("No you see me", 1000)} />
        </SectionDemo>
        <SectionDemo title="Reactive support">
          <UseStateDemo />
        </SectionDemo>
        <SectionDemo title="Timer demo difficult? Why?">
          <TimerDemo />
        </SectionDemo>
        <SectionDemo title="Custom render function">
          <CustomRenderDemo />
        </SectionDemo>
      </PageContent>
    </Page>
  );
}
