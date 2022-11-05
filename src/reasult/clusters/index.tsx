import { jsxFactory, useContext } from "@xania/view";
import { Observable } from "rxjs";
import { Fab } from "../../layout/fab";
import { useFormData } from "../../layout/form-data";
import { PageHeader } from "../../layout/page/header";
import { Page, PageContent } from "../../layout/page";
import { Select } from "../../layout/select";
import { TextField } from "../../layout/text-field";
import { RouteContext } from "../../router/router-context";
import { Cluster, queryCluster } from "../api/db";
import { fetchCluster, upsertCluster } from "../functions";
import { selectOptions } from "../utils/select-utils";
import * as Ro from "rxjs/operators";
import { List } from "@xania/view/lib/directives/list";
import classes from "./clusters.module.scss";

const jsx = jsxFactory({ classes });

export async function ClusterView(
  context: RouteContext,
  callback: (cluster: Cluster) => void
) {
  const { id, processId } = context.params;
  const response = await fetchCluster(id, processId);
  const clusterForm = useFormData(response.cluster);

  const indexMethods = selectOptions(response.lists.indexMethods);

  return {
    get view() {
      return (
        <Page>
          {clusterForm.onChange((cluster) =>
            upsertCluster({ processId, cluster }).then((_) => {
              queryCluster(cluster.id, processId).then(console.log);
              callback(cluster);
            })
          )}
          <PageHeader title={`Configure cluster (${response.cluster.code})`} />
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
                  value={clusterForm.get("finantialStatementId")}
                >
                  {selectOptions(response.lists.financialStatements)}
                </Select>
                <Select label="Strategy" value={clusterForm.get("strategyId")}>
                  {selectOptions(response.lists.strategies)}
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
                <Select label="ERV" value={clusterForm.get("ervIndexMethodId")}>
                  {indexMethods}
                </Select>
                <Select label="VPV" value={clusterForm.get("vpvIndexMethodId")}>
                  {indexMethods}
                </Select>
                <Select label="FAM" value={clusterForm.get("famIndexMethodId")}>
                  {indexMethods}
                </Select>
                <Select
                  label="Land value"
                  value={clusterForm.get("landValueIndexMethodId")}
                >
                  {indexMethods}
                </Select>
                <Select
                  label="Target rent"
                  value={clusterForm.get("targetRentIndexMethodId")}
                >
                  {indexMethods}
                </Select>
                <Select
                  label="Renewal rent"
                  value={clusterForm.get("renewalRentIndexMethodId")}
                >
                  {indexMethods}
                </Select>
              </div>
            </div>
          </PageContent>
        </Page>
      );
    },
  };
}

export interface ProcessClustersProps {
  processId: string;
  updates: Observable<Cluster>;
  url: string;
}

export async function ProcessClusters(props: ProcessClustersProps) {
  const { updates, processId } = props;

  const initial = await queryCluster(null, processId);

  const clusters = updates.pipe(
    Ro.map((u) => {
      const idx = initial.findIndex((e) => e.id == u.id);
      initial[idx] = u;
      return initial;
    }),
    Ro.startWith(initial)
  );

  const highliteClass = classes["highlite"];
  function highlite(cluster: Cluster, node: Node) {
    updates.subscribe((u) => {
      if (u.id === cluster.id) {
        const a = node.parentElement;
        if (!a.classList.contains(highliteClass)) {
          a.classList.add(highliteClass);

          console.log("highlite", { a });

          setTimeout((_) => {
            a.classList.remove(highliteClass);
          }, 1000);
        }
      }
    });
  }

  const $ = useContext<Cluster>();
  return (
    <div class="mdc-list">
      <List data={clusters}>
        <a
          href={$((cluster) => props.url + "/cluster/" + cluster.id, "id")}
          class="mdc-list-item router-link mdc-list-item--with-trailing-icon"
        >
          {$(highlite)}
          <span class="mdc-list-item__content">
            {$("name")} ({$("code")})
          </span>
          <span class="material-icons mdc-list-item__end">arrow_right</span>
        </a>
      </List>
    </div>
  );
}
