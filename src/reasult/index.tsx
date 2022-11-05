import { Cluster, queryCluster, queryClusters } from "./api/db";
import { createView, jsxFactory, RenderTarget, useState } from "@xania/view";
import { route, RouteComponent } from "../router/route-resolver";
import { MDCRipple } from "@material/ripple";
import { Page, PageContent } from "../layout/page";
import { regex } from "../router/matchers";
import { PageHeader } from "../layout/page/header";
import { SettingsView } from "./settings";
import { TextField } from "../layout/text-field";
import { IconButton } from "../layout/icon-button";
import * as Rx from "rxjs";
import "./toggle.scss";
import { delay } from "../layout/helpers";
import { Fab } from "../layout/fab";
import {
  Contract,
  ContractLine,
  ContractsResponse,
  fetchContractIndexMethod,
  fetchContracts,
  fetchHomeOverview,
  fetchPortfolioOverview,
  fetchPropertyIndexes,
  fetchStandingProcessConfiguration,
  HomeResponse,
  InputValueLevel,
  PortfolioItem,
  PortfolioItemType,
  PortfolioResponse,
  ProcessStatus,
  StandingProcessConfiguration,
  updateProcessStatus,
  updateStandingProcessConfiguration,
} from "./functions";
import { NewProcess } from "./process/new-process";
import { ClusterView, ProcessClusters } from "./clusters";
import "./api/db";
import { useFormData } from "../layout/form-data";
import { RouteContext } from "../router/router-context";

const jsx = jsxFactory({});

export async function ReasultApp(): Promise<RouteComponent> {
  const home: HomeResponse = await fetchHomeOverview();

  return {
    get view() {
      return (
        <Page>
          <PageHeader title="REM" />
          <PageContent>
            <a
              href="/reasult/settings"
              class="mdc-button button-button router-link"
            >
              Settings
            </a>
            {home.activeProcesses.map(activeProcessView)}
            <a href={`/reasult/new-process`} class="router-link">
              <Fab icon="add" />
            </a>
          </PageContent>
        </Page>
      );
    },
    routes: [
      route(["settings"], SettingsView),
      route(["new-process"], NewProcess),
      route([":processId", "edit"], ProcessCofigurationView),
      // route(regex(/(?<id>.+)/i), (e) => <ProcessDetail processId={e.id} />),
    ],
  };

  function activeProcessView(process: HomeResponse["activeProcesses"][number]) {
    return (
      <>
        <div class="mdc-card">
          <a class="mdc-card__action router-link">
            {MDCRipple}
            <div class="mdc-card__content">
              <h2 class="mdc-card__title--headline">{process.name}</h2>
              <h3 class="mdc-card__title--subtitle">
                {process.typeDescription}
              </h3>
              <div>
                <label>by:</label> {process.createdBy}
              </div>
              <div>
                <label>forecast:</label> {process.forecastDate}
              </div>
              <div>
                <label>assets:</label> {process.totalAssets}
              </div>
              <div>
                <label>reporting lang:</label> {process.reportingLanguage}
              </div>
              <div>
                <label>auto sync settings:</label> {process.autoSyncSettings}
              </div>
            </div>
          </a>
          <div class="mdc-card__actions">
            <a href={`/reasult/${process.id}/edit`} class="router-link">
              <IconButton>
                <span class="material-icons">edit</span>
              </IconButton>
            </a>
            <ToggleButton
              on={process.status === ProcessStatus.Open}
              click={(state) =>
                updateProcessStatus(
                  process.id,
                  state ? ProcessStatus.Closed : ProcessStatus.Open
                )
              }
            />
          </div>
        </div>
      </>
    );
  }
}

interface ToggleButtonProps {
  on: boolean;
  click: (state: boolean) => Promise<void>;
}

function ToggleButton(props: ToggleButtonProps) {
  const initial = props.on ? "toggle_on" : "toggle_off";
  const toggleState = useState(initial);
  const classState = useState(initial);

  return (
    <button
      class={[classState]}
      click={() => {
        const prev = toggleState.current;
        const next = prev.includes("toggle_off") ? "toggle_on" : "toggle_off";
        toggleState.update((_) => "sync");
        classState.update((_) => "toggle_loading");
        delay(props.click(prev.includes("toggle_on")), 1000).then((_) => {
          toggleState.update((_) => next);
          classState.update((_) => toggleState.current);
        });
      }}
    >
      <IconButton>
        <span class="material-icons">{toggleState}</span>
      </IconButton>
    </button>
  );
}

function on<T>(event: string, fetch: () => Promise<T>) {
  return {
    view(template, defaultValue) {
      const view = createView(template);

      return {
        render(target: RenderTarget) {
          view.render(target);
          view.update([defaultValue]);

          target.addEventListener(event, handler);
          function handler() {
            Rx.from(fetch()).subscribe((icon) => view.update([icon]));
          }
          return {
            dispose() {
              target.removeEventListener(event, handler);
            },
          };
        },
      };
    },
  };
}

async function ProcessCofigurationView(context: RouteContext) {
  const processId = context.params.processId;
  const response = await fetchStandingProcessConfiguration();
  var config: StandingProcessConfiguration = { ...response };
  const portfolio = await fetchPortfolioOverview(processId);
  const properties = getProperties(portfolio);

  async function save() {
    updateStandingProcessConfiguration(config);
  }

  const formData = useFormData(config);
  const events = new Rx.Subject<Cluster>();

  return {
    get view() {
      return (
        <Page>
          <PageHeader title={config.name} />
          <PageContent>
            <div class="mdc-card">
              <div class="mdc-card__content">
                <label>Process</label>
                <TextField label="Type" value={response.processType} />
                <TextField label="ID" value={formData.get("code")} />
                <TextField label="Name" value={formData.get("name")} />
              </div>
            </div>

            <div class="mdc-card">
              <div class="mdc-card__content">
                <label>Dates and Periods</label>
                <TextField
                  label="Start date forecast"
                  value={formData.get("forecastDate")}
                />
                <TextField
                  label="Value date"
                  value={formData.get("valuationDate")}
                />
                <TextField
                  label="Forecast period"
                  value={formData.get("forecastPeriod").get("value")}
                  sideLabel="months"
                />
              </div>
            </div>

            <div class="mdc-card">
              <div class="mdc-card__content">
                <label>Assets</label>
                <div class="mdc-list">
                  {properties.map((e, i) => (
                    <a
                      href={`${context.url}/${i}`}
                      class="mdc-list-item router-link mdc-list-item--with-trailing-icon"
                    >
                      <span class="mdc-list-item__content">
                        {e.asset.name} - {e.property.name}
                      </span>
                      {MDCRipple}
                      <span class="material-icons mdc-list-item__end">
                        arrow_right
                      </span>
                    </a>
                  ))}
                </div>
              </div>
              <div class="mdc-card__actions">
                <a>
                  <IconButton>
                    <span class="material-icons">edit</span>
                  </IconButton>
                </a>
              </div>
            </div>
            <div class="mdc-card">
              <div class="mdc-card__content">
                <label>clusters</label>
                <ProcessClusters
                  url={context.url}
                  updates={events}
                  processId={processId}
                />
              </div>
              <div class="mdc-card__actions">
                <a href={`${context.url}/cluster`} class="router-link">
                  <IconButton>
                    <span class="material-icons">add</span>
                  </IconButton>
                </a>
              </div>
            </div>
          </PageContent>
        </Page>
      );
    },
    routes: [
      route(regex(/(?<id>\d+)/i), (context: RouteContext) =>
        PropertyView(context, properties[context.params.id])
      ),
      route(["cluster", ":id"], (context) =>
        ClusterView(context, (cluster) => events.next(cluster))
      ),
    ],
  };
}

async function PropertyView(
  context: RouteContext,
  pair: { property: PortfolioItem; asset: PortfolioItem }
) {
  const { processId } = context.params;
  const { property, asset } = pair;

  const contracts = await fetchContracts(processId, asset.id, property.id);
  const jsx = jsxFactory({});

  return {
    get view() {
      return (
        <Page>
          <PageHeader title={property.name} />
          <PageContent>
            <button
              class="mdc-button"
              click={(_) =>
                fetchPropertyIndexes(processId, asset.id, property.id)
              }
            >
              Indexes
            </button>

            <div class="mdc-list">
              {contracts.items
                .filter((e) => e.itemType === InputValueLevel.ContractLine)
                .map((e) => (
                  <a
                    // href={`${props.base}/${e.code}`}
                    click={(_) => select(e as ContractLine)}
                    class="mdc-list-item router-link"
                  >
                    {MDCRipple}
                    <span class="mdc-list-item__content">{e.name}</span>
                    <span class="mdc-list-item__end">{e.code}</span>
                  </a>
                ))}
            </div>
          </PageContent>
        </Page>
      );
    },
    // routes: [route(regex(/(?<code>.+)/), )],
  };

  function select(contractLine: ContractLine) {
    const contract = findContract(contractLine, contracts.items);
    console.log({ contract, contractLine });

    fetchContractIndexMethod(
      processId,
      asset.id,
      property.id,
      contract.id,
      contractLine.id
    );
  }
}

function findContract(
  subject: ContractLine,
  items: ContractsResponse["items"]
): Contract {
  for (const h of subject.hierarchy) {
    for (const item of items) {
      if (item.code === h && item.itemType === InputValueLevel.Contract)
        return item as Contract;
    }
  }
  return null;
}

function getProperties(
  portfolio: PortfolioResponse
): { property: PortfolioItem; asset: PortfolioItem }[] {
  function findAsset(property: PortfolioResponse["items"][number]) {
    for (const h in property.hierarchy) {
      const asset = portfolio.items.find(
        (item) => item.type === PortfolioItemType.Asset
      );
      if (asset) return asset;
    }
  }
  return portfolio.items
    .filter((e) => e.type === PortfolioItemType.Property)
    .map((e) => ({
      property: e,
      asset: findAsset(e),
    }));
}
