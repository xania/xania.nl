import { jsxFactory } from "@xania/view";
import { PageHeader } from "../../layout/page/header";
import { Page, PageContent } from "../../layout/page";

const jsx = jsxFactory({});

export function NewProcess() {
  return {
    get view() {
      return (
        <Page>
          <PageHeader title="New Process" />
          <PageContent>new process</PageContent>
        </Page>
      );
    },
  };
}
