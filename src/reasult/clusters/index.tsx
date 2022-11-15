import { jsxFactory } from "@xania/view";
import { useFormData } from "../../layout/form-data";
import { PageHeader } from "../../layout/page/header";
import { Page, PageContent } from "../../layout/page";
import { Select } from "../../layout/select";
import { TextField } from "../../layout/text-field";
import { RouteContext } from "../../router/router-context";
import {
  UpdateStandingProcessConfigurationCommand,
  StandingProcessConfigurationResponse,
  ListItem,
} from "../functions";
import { selectOptions } from "../utils/select-utils";
import classes from "./clusters.module.scss";
import { Fields, MarketValueStrategy } from "../api/types";
import { marketValueStrategies } from "../list-items";

const jsx = jsxFactory({ classes });

type Cluster = StandingProcessConfigurationResponse["clusters"][number];

export function ClusterView(
  context: RouteContext,
  command: UpdateStandingProcessConfigurationCommand,
  lists: StandingProcessConfigurationResponse["lists"],
  isStrategyRequired: boolean,
  callback: (cluster: Cluster) => void
) {
  const index = parseInt(context.params.index);
  const cluster = command.clusters[index];
  if (!cluster) {
    return <div>cluster at {index} not found</div>;
  }
  const clusterForm = useFormData(cluster);

  const indexMethods = selectOptions(lists.indexMethods);

  return {
    get view() {
      return (
        <Page>
          <PageHeader title={`Configure cluster`} />
          <PageContent>
            <div class="mdc-card">
              <div class="mdc-card__content">
                <label>General</label>
                <TextField label="Cluster Name" value={cluster.name} />
                <Select
                  label="Finantial statement"
                  value={clusterForm.get("financialStatementId")}
                >
                  {selectOptions(lists.financialStatements)}
                </Select>
                {isStrategyRequired && (
                  <Select
                    label="Strategy"
                    value={clusterForm.get("strategyId")}
                  >
                    {selectOptions(marketValueStrategies)}
                  </Select>
                )}
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
