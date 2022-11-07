import { jsxFactory } from "@xania/view";

const jsx = jsxFactory({});
export function PaletZuidApp() {
  return {
    get view() {
      return <div>hallo palet</div>;
    },
  };
}
