import { jsxFactory, useContext } from "@xania/view";
import { useFormData } from "../../layout/form-data";
import { Select } from "../../layout/select";
import {
  fetchDefaultProcessClusters,
  ListItem,
  StandingProcessConfigurationResponse,
  UpdateStandingProcessConfigurationCommand,
} from "../functions";
import { selectOptions } from "../utils/select-utils";
import * as Rx from "rxjs";
import * as Ro from "rxjs/operators";
import { List } from "@xania/view/lib/directives/list";
import { ClusterCharacteristic } from "../api/types";

const jsx = jsxFactory({});

type Cluster = StandingProcessConfigurationResponse["clusters"][number];

export interface ProcessClustersProps {
  url: string;
  command: UpdateStandingProcessConfigurationCommand;
  lists: StandingProcessConfigurationResponse["lists"];
  processId: string;
}

export async function ProcessClusters(props: ProcessClustersProps) {
  const { processId, command } = props;
  const clusters = new Rx.Subject<Cluster[]>();

  var settingsForm = useFormData(command);

  settingsForm.get("clusterCharacteristic").change(async (x) => {
    const result = await fetchDefaultProcessClusters(processId, x);
    command.clusters = result.clusters;
    clusters.next(result.clusters);
  });

  const $ = useContext<Cluster>();
  return (
    <>
      <Select
        label="Cluster Characteristic"
        value={settingsForm.get("clusterCharacteristic").asInt()}
      >
        {selectOptions(clusterCharacteristics)}
      </Select>

      <div class="mdc-list">
        <List data={clusters.pipe(Ro.startWith(command.clusters))}>
          <a
            href={$((_, context) => props.url + "/cluster/" + context.index)}
            class="mdc-list-item mdc-list-item--with-two-lines router-link mdc-list-item--with-trailing-icon"
          >
            <span class="mdc-list-item__content">
              <span class="mdc-list-item__primary-text">
                {$("name")} ({$("numberOfAssets")})
              </span>
              <span class="mdc-list-item__secondary-text">
                {$(
                  (cluster) =>
                    cluster.characteristics
                      ? Object.keys(cluster.characteristics)
                          .map((e) => `${e} = ${cluster.characteristics[e]}`)
                          .join(", ")
                      : "",
                  "characteristics"
                )}
              </span>
            </span>
            <span class="material-icons mdc-list-item__end">arrow_right</span>
          </a>
        </List>
      </div>
    </>
  );
}

// const highliteClass = classes["highlite"];
// function highlite(cluster: Cluster, node: Node) {
//   clusters.subscribe((u) => {
//     // if (u === cluster) {
//     //   const a = node.parentElement;
//     //   if (!a.classList.contains(highliteClass)) {
//     //     a.classList.add(highliteClass);
//     //     setTimeout((_) => {
//     //       a.classList.remove(highliteClass);
//     //     }, 1000);
//     //   }
//     // }
//   });
// }

const clusterCharacteristics: ListItem<ClusterCharacteristic>[] = [
  { id: ClusterCharacteristic.Sector, name: "Sector" },
  { id: ClusterCharacteristic.City, name: "City" },
];
