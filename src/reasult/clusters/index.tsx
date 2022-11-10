import { jsxFactory, useContext } from "@xania/view";
import { Observable } from "rxjs";
import { useFormData } from "../../layout/form-data";
import { PageHeader } from "../../layout/page/header";
import { Page, PageContent } from "../../layout/page";
import { Select } from "../../layout/select";
import { TextField } from "../../layout/text-field";
import { RouteContext } from "../../router/router-context";
import {
  UpdateStandingProcessConfigurationCommand,
  StandingProcessConfigurationResponse,
  upsertCluster,
} from "../functions";
import { selectOptions } from "../utils/select-utils";
import classes from "./clusters.module.scss";
import { Fields } from "../api/types";

const jsx = jsxFactory({ classes });

type Cluster = StandingProcessConfigurationResponse["clusters"][number];

export function ClusterView(
  context: RouteContext,
  command: UpdateStandingProcessConfigurationCommand,
  lists: StandingProcessConfigurationResponse["lists"],
  callback: (cluster: Cluster) => void
) {
  const index = parseInt(context.params.index);
  const cluster = command.clusters[index];
  const clusterForm = useFormData(cluster);

  const indexMethods = selectOptions(lists.indexMethods);

  return {
    get view() {
      return (
        <Page>
          <PageHeader title={`Configure cluster (${cluster.code})`} />
          <PageContent>
            <div class="mdc-card">
              <div class="mdc-card__content">
                <label>General</label>
                <TextField label="Cluster ID" value={clusterForm.get("code")} />
                <TextField
                  label="Cluster Name"
                  value={clusterForm.get("name")}
                />
                <Select
                  label="Finantial statement"
                  value={clusterForm.get("financialStatementId")}
                >
                  {selectOptions(lists.financialStatements)}
                </Select>
                <Select label="Strategy" value={clusterForm.get("strategyId")}>
                  {selectOptions(lists.strategies)}
                </Select>
                <TextField
                  label="Risk free rate"
                  sideLabel="%"
                  value={clusterForm.get("riskFreeRate").asPerc()}
                />
              </div>
            </div>
            <div class="mdc-card">
              <div class="mdc-card__content">
                <label>General</label>
                {IndexMethods()}
              </div>
            </div>
          </PageContent>
        </Page>
      );
    },
  };
  function IndexMethods() {
    var result = [];

    const keys = Object.keys(Fields);
    console.log(Fields);
    for (const f in Fields) {
      if (typeof Fields[Fields[f]] === "string") {
        result.push(
          <Select
            label={f}
            value={clusterForm.get("indexMethods").get(f as any)}
          >
            {indexMethods}
          </Select>
        );
      }
    }
    return result;
  }
}
