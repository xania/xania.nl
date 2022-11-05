import { jsxFactory } from "@xania/view";
import { SelectOption } from "../../layout/select";

const jsx = jsxFactory({});

export function selectOptions<T>(items: { id: T; name: string }[]) {
  if (items)
    return items.map((im) => (
      <li>
        <SelectOption value={im.id.toString()} label={im.name} />
      </li>
    ));
}
