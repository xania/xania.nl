import { jsxFactory } from "@xania/view";
import { useFormData } from "../../layout/form-data";
import { Page, PageContent } from "../../layout/page";
import { PageHeader } from "../../layout/page/header";
import { Select } from "../../layout/select";
import { RouteContext } from "../../router/router-context";
import { query } from "../api/db";
import { EntityStatus, ReferenceEntityType } from "../api/types";
import { fetchProcessClusterSettings } from "../functions";
import { selectOptions } from "../utils/select-utils";

const jsx = jsxFactory({});

export async function ProcessClusterSettings(context: RouteContext) {
  const processId = context.params.processId;

  const result = await query(
    "rem",
    `
    select d, r.pk from r 
    join d in r.data
    where r.type = 'RefLocalizedEntity'
    and d.entityType = ${ReferenceEntityType.Sector}
    and d.status = ${EntityStatus.Active}
    `
  );
  console.log(result);

  const settings = await fetchProcessClusterSettings(processId);

  console.log(settings);
  var settingsForm = useFormData({
    filterScope: settings.filterScope,
  });

  return {
    get view() {
      return (
        <Page>
          <PageHeader title="Cluster settings" />
          <PageContent>
            <div class="mdc-card">
              <div class="mdc-card__content">
                <Select
                  label="Filter scope"
                  value={settingsForm.get("filterScope")}
                >
                  {selectOptions(settings.lists.filterScopes)}
                </Select>
                <Select
                  label="Filter scope"
                  value={settingsForm.get("filterScope")}
                >
                  {selectOptions(settings.lists.filterScopes)}
                </Select>
              </div>
            </div>
          </PageContent>
        </Page>
      );
    },
  };
}
