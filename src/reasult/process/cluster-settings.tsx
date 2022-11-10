import { jsxFactory, useContext } from "@xania/view";
import { useFormData } from "../../layout/form-data";
import { Page, PageContent } from "../../layout/page";
import { PageHeader } from "../../layout/page/header";
import { Select } from "../../layout/select";
import { route } from "../../router/route-resolver";
import { RouteContext } from "../../router/router-context";
import { ClusterView } from "../clusters";
import {
  fetchInitialProcessClusters,
  StandingProcessConfigurationResponse,
  UpdateStandingProcessConfigurationCommand,
} from "../functions";
import { selectOptions } from "../utils/select-utils";
import * as Rx from "rxjs";
import * as Ro from "rxjs/operators";
import { List } from "@xania/view/lib/directives/list";

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
    const result = await fetchInitialProcessClusters(processId, x);
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
        {selectOptions(props.lists.clusterCharacteristics)}
      </Select>

      <div class="mdc-list">
        <List data={clusters.pipe(Ro.startWith(command.clusters))}>
          <a
            href={$((_, context) => props.url + "/cluster/" + context.index)}
            class="mdc-list-item router-link mdc-list-item--with-trailing-icon"
          >
            {/* {$(highlite)} */}
            <span class="mdc-list-item__content">
              {$("name")} ({$("code")})
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
