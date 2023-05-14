import { Link, Route } from "xania/router";
import { Page } from "~/layout/page";
import { Case } from "./item";

export function Cases() {
  const cases = loadCases();

  return (
    <>
      <Page>
        cases
        <div>
          <ul>
            {cases.map((c) => (
              <div>
                [{c.id}]{" "}
                <a>
                  {c.title} <Link to={`case/${c.id}`} />
                </a>
              </div>
            ))}
          </ul>
        </div>
      </Page>

      <Route path="case/:id">
        <Case />
      </Route>
    </>
  );
}

function loadCases(): CaseListItem[] {
  return [
    { id: 1, title: "case 1" },
    { id: 2, title: "case 2" },
    { id: 3, title: "case 3" },
  ];
}

interface CaseListItem {
  id: number;
  title: string;
}
