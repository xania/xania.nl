import { createView, jsxFactory, RenderTarget, useState } from "@xania/view";
import { route, RouteComponent } from "../router/route-resolver";
import { MDCRipple } from "@material/ripple";
import { Page, PageContent } from "../layout/page";
import { PageHeader } from "../layout/page/header";
import { TextField } from "../layout/text-field";
import { IconButton } from "../layout/icon-button";
import * as Rx from "rxjs";
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
  updateProcessStatus,
  updateStandingProcessConfiguration,
  UpdateStandingProcessConfigurationCommand,
} from "./functions";
import { NewProcess } from "./process/new-process";
import "./api/db";
import { useFormData } from "../layout/form-data";
import { RouteContext } from "../router/router-context";
import { ProcessClusters } from "./process/cluster-settings";
import { ClusterView } from "./clusters";
import { Select } from "../layout/select";
import { selectOptions } from "./utils/select-utils";
import { forecastLevels, languages, periodTypes } from "./list-items";
import { ToggleButton } from "../layout/icon-button/toggle-button";

const jsx = jsxFactory({});

export async function ReasultApp(): Promise<RouteComponent> {
  const home: HomeResponse = await fetchHomeOverview();

  return {
    get view() {
      return (
        <Page>
          <PageHeader title="REM" />
          <PageContent>
            {home.activeProcesses.map(activeProcessView)}
            <a href={`/reasult/new-process`} class="router-link">
              <Fab icon="add" />
            </a>
          </PageContent>
        </Page>
      );
    },
    routes: [
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
                <label>forecast:</label> {process.forecastDate}
              </div>
              <div>
                <label>assets:</label> {process.totalAssets}
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
  var command: UpdateStandingProcessConfigurationCommand = {
    clusterCharacteristic: response.clusterCharacteristic,
    clusters: response.clusters,
    code: response.code,
    forecastDate: response.forecastDate,
    valuationDate: response.valuationDate,
    forecastPeriod: response.forecastPeriod,
    name: response.name,
    periodType: response.periodType,
    autoUpdatingSettings: response.autoUpdatingSettings,
    forecastLevel: response.forecastLevel,
    reportingLanguage: response.reportingLanguage,
  };
  const portfolio = await fetchPortfolioOverview(processId);
  const properties = getProperties(portfolio);

  async function save() {
    updateStandingProcessConfiguration(command);
  }

  const formData = useFormData(command);

  return {
    get view() {
      return (
        <Page>
          <button click={save}>
            <Fab icon="save" />
          </button>
          <PageHeader title={command.name} />
          <PageContent>
            <div class="mdc-card">
              <div class="mdc-card__content">
                <label>Process</label>
                <TextField label="Type" value={response.processType} />
                <TextField label="ID" value={formData.get("code")} />
                <TextField label="Name" value={formData.get("name")} />
                <Select
                  label="Reporing language"
                  value={formData.get("reportingLanguage").asInt()}
                >
                  {selectOptions(languages)}
                </Select>
              </div>
            </div>

            <div class="mdc-card">
              <div class="mdc-card__content">
                <label>Dates and Periods</label>
                <Select
                  label="Period type"
                  value={formData.get("periodType").asInt()}
                >
                  {selectOptions(periodTypes)}
                </Select>
                <TextField
                  label="Start date forecast"
                  value={formData.get("forecastDate")}
                />
                <Select
                  label="Forecast level"
                  value={formData.get("forecastLevel").asInt()}
                >
                  {selectOptions(forecastLevels)}
                </Select>
                <TextField
                  label="Value date"
                  value={formData.get("valuationDate")}
                />
                <TextField
                  label="Forecast period"
                  value={formData.get("forecastPeriod").get("value").asInt()}
                  sideLabel="months"
                />
              </div>
            </div>

            <div class="mdc-card">
              <div class="mdc-card__content">
                <ProcessClusters
                  command={command}
                  lists={response.lists}
                  processId={processId}
                  url={context.url}
                />
              </div>
            </div>

            <div class="mdc-card">
              <div class="mdc-card__content">
                <label>Properties</label>
                <div class="mdc-list">
                  {properties.map((e, i) => (
                    <a
                      href={`${context.url}/asset/${e.asset.id}/prop/${e.property.id}`}
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
            {/* <div class="mdc-card">
              <div class="mdc-card__content">
                <label>clusters</label>
                <ProcessClusterConfigurationView
                  url={context.url}
                  updates={events}
                  processId={processId}
                  clusters={response.clusters}
                />
              </div>
              <div class="mdc-card__actions">
                <a href={`${context.url}/clusters`} class="router-link">
                  <IconButton>
                    <span class="material-icons">settings</span>
                  </IconButton>
                </a>
              </div>
            </div> */}
          </PageContent>
        </Page>
      );
    },
    routes: [
      route(["asset", ":assetId", "prop", ":propertyId"], PropertyView),
      route(["cluster", ":index"], (context) =>
        ClusterView(
          context,
          command,
          response.lists,
          response.isStrategyRequired,
          (cluster) => {}
        )
      ),
    ],
  };
}

async function PropertyView(context: RouteContext) {
  const { processId, propertyId, assetId } = context.params;

  const contracts = await fetchContracts(processId, assetId, propertyId);
  const jsx = jsxFactory({});

  return {
    get view() {
      return (
        <Page>
          <PageHeader title="Contracts" />
          <PageContent>
            <button
              class="mdc-button"
              click={(_) =>
                fetchPropertyIndexes(processId, assetId, propertyId)
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
      assetId,
      propertyId,
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
