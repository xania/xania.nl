import { Attrs } from "xania";
import { Link, Route, useRouteContext } from "xania/router";
import { Page } from "~/layout/page";

export function Case() {
  const routeContext = useRouteContext();
  function onDrop(e: JSX.EventContext<DragEvent>) {
    e.event.preventDefault();
    const items = e.event.dataTransfer?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        switch (item.kind) {
          case "string":
            if (item.type === "text/plain") {
              item.getAsString(console.log);
            }
            break;
          default:
            console.log(item);
            break;
        }
      }
    }
  }
  function onDropOver(e: JSX.EventContext) {
    e.event.preventDefault();
  }
  return (
    <>
      <Page>
        <Attrs drop={onDrop} paste={onDrop} dragover={onDropOver} />
        case {routeContext.params.prop("id")}
        <div>
          {loadDocuments().map((d) => (
            <div>
              doc [{d.id}]
              <a>
                {d.title} <Link to={`doc/${d.id}`} />
              </a>
            </div>
          ))}
        </div>
      </Page>
      <Route path="doc/:id">
        <Page>{routeContext.params.prop("id")}</Page>
      </Route>
    </>
  );
}

function loadDocuments(): DocumentListItem[] {
  return [
    { id: 1, title: "doc 1" },
    { id: 2, title: "doc 2" },
    { id: 3, title: "doc 3" },
    { id: 4, title: "doc 4" },
  ];
}

interface DocumentListItem {
  id: number;
  title: string;
}
