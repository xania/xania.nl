import { Link, Route, useRouteContext } from "xania/router";
import { Page } from "~/layout/page";

export function Case() {
  const routeContext = useRouteContext();
  return (
    <>
      <Page>
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
