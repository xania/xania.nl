import { Css, jsxFactory, RenderTarget } from "@xania/view";
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
  ClassListDemo,
  FormElementsDemo,
} from "./examples";
import "./style.scss";
import classes from "./css.module.scss";
import { RouteContext } from "../../router/router-context";
import { route } from "../../router/route-resolver";
import { TodoApp } from "../todo";

const jsx = jsxFactory({ classes });

export function HowtoApp(context: RouteContext) {
  return {
    get view() {
      return (
        <Page>
          <PageContent>
            <p class="info">
              <h2>Core features of xania are demo's here</h2>
              <p>
                This is all you need to know to understand xania,
                <br />
                everything else is just you and how creative you are
              </p>
              <p>
                Click here to find more advanced examples build <br />
                on top of the core features below
              </p>
            </p>
            <a
              class="demo-link router-link"
              href={`${context.url}/basic-elements`}
            >
              basic elements
            </a>
            <a
              class="demo-link router-link"
              href={`${context.url}/dynamic-elements`}
            >
              dynamic elements
            </a>
            <a
              class="demo-link router-link"
              href={`${context.url}/form-elements`}
            >
              form elements
            </a>
            <a class="demo-link router-link" href={`${context.url}/todo`}>
              todo app
            </a>
          </PageContent>
        </Page>
      );
    },
    routes: [
      route(["basic-elements"], BasicElements),
      route(["dynamic-elements"], DynamicElements),
      route(["form-elements"], FormElements),
      route(["todo"], TodoApp),
    ],
  };
}

export function FormElements() {
  return (
    <Page>
      <PageContent>
        <SectionDemo title="Simple element with text content">
          <FormElementsDemo />
        </SectionDemo>
      </PageContent>
    </Page>
  );
}

export function BasicElements() {
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
        <SectionDemo title="Css module support">
          <CssModuleDemo />
        </SectionDemo>
      </PageContent>
    </Page>
  );
}

export function DynamicElements() {
  return (
    <Page>
      <PageContent>
        <SectionDemo title="Async text content">
          <DelayedTextContent value={delay("Now you see me", 1000)} />
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
        <SectionDemo title="Element class list consists of constant and dynamic values">
          <ClassListDemo />
        </SectionDemo>
        <SectionDemo title="Multiple  root elements can be of any type">
          <MultipleRootElementsDemo />
        </SectionDemo>
      </PageContent>
    </Page>
  );
}
