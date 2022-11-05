import { Config } from "./api/config";
import { Cluster } from "./api/db";

export interface HomeResponse {
  activeProcesses: {
    status: ProcessStatus;
    id: string;
    code: string;
    name: string;
    totalAssets: number;
    createdBy: string;
    typeDescription: string;
    forecastDate: string;
    reportingLanguage: string;
    autoSyncSettings: boolean;
  }[];
}

interface StandingProcessConfigurationResponse {
  forecastPeriod?: { value; timeUnit };
  valuationDate: string;
  forecastDate: string;
  code: string;
  processType: string;
  name: string;
}

export function fetchStandingProcessConfiguration(): Promise<StandingProcessConfigurationResponse> {
  return fetch(
    `${Config.RemBaseUrl}/query/process/StandingProcessConfiguration`
  ).then((e) => e.json());
}

export interface StandingProcessConfiguration {
  forecastPeriod?: { value; timeUnit };
  valuationDate: string;
  forecastDate: string;
  code: string;
  name: string;
}
export function updateStandingProcessConfiguration(
  data: StandingProcessConfiguration
): Promise<void> {
  return fetch(
    `${Config.RemBaseUrl}/command/process/UpdateStandingProcessConfiguration`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  ).then((e) => e.json());
}

export function fetchPortfolioOverview(
  processId: string
): Promise<PortfolioResponse> {
  return fetch(
    `${Config.RemBaseUrl}/query/Portfolio/Overview?processId=${processId}`
  ).then((e) => e.json());
}

export interface ProcessInfoResponse {
  name: string;
}

export interface PortfolioResponse {
  items: {
    hierarchy: string[];
    id: string;
    name: string;
    type: PortfolioItemType;
  }[];
}

export type PortfolioItem = PortfolioResponse["items"][number];

export enum PortfolioItemType {
  Portfolio = 1,
  Group = 2,
  Asset = 3,
  Property = 4,
}

export enum ProcessStatus {
  None = 0,
  Open = 1,
  Completed = 2,
  Closed = 3,
}

export function fetchContracts(
  processId,
  assetId,
  propertyId
): Promise<ContractsResponse> {
  return fetch(
    `${Config.RemBaseUrl}/query/contract/contracts?processId=${processId}&assetId=${assetId}&propertyId=${propertyId}`
  ).then((e) => e.json());
}

export function fetchProcessInfo(
  processId: string
): Promise<ProcessInfoResponse> {
  return fetch(
    `${Config.RemBaseUrl}/query/process/info?processId=${processId}`
  ).then((e) => e.json());
}

export function updateProcessStatus(
  processId: string,
  processStatus: ProcessStatus
): Promise<any> {
  return fetch(`${Config.RemBaseUrl}/command/process/updatestatus`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      processId,
      processStatus,
    }),
  });
}

export interface ContractsResponse {
  items: {
    id: string;
    hierarchy: string[];
    code: string;
    contractType: string;
    address: string;
    name: string;
    itemType: InputValueLevel;
  }[];
}

export enum InputValueLevel {
  Property = 1,
  RentableUnitType = 2,
  RentableUnit = 3,
  Contract = 4,
  ContractLine = 5,
}

export type ContractLine = {
  itemType: InputValueLevel.ContractLine;
} & ContractsResponse["items"][number];

export type Contract = {
  itemType: InputValueLevel.Contract;
} & ContractsResponse["items"][number];

export interface ContractIndexMethodResponse {}

export function fetchContractIndexMethod(
  processId,
  assetId,
  propertyId,
  contractId,
  contractLineId
): Promise<ContractIndexMethodResponse> {
  return fetch(
    `${Config.RemBaseUrl}/query/contract/contractindexmethod?processId=${processId}&assetId=${assetId}&propertyId=${propertyId}&contractId=${contractId}&contractLineId=${contractLineId}`
  ).then((e) => e.json());
}

export interface PropertyOverviewResponse {
  id: string;
}

export function fetchPropertyOverview(
  processId,
  assetId,
  propertyId
): Promise<PropertyOverviewResponse> {
  return fetch(
    `${Config.RemBaseUrl}/query/property/overview?processId=${processId}&assetId=${assetId}&propertyId=${propertyId}`
  ).then((e) => e.json());
}

export async function fetchPropertyIndexes(
  processId,
  assetId,
  propertyId
): Promise<any> {
  const response = await fetch(
    `${Config.RemBaseUrl}/query/property/indexes?processId=${processId}&assetId=${assetId}&propertyId=${propertyId}`
  ).then((e) => e.json());
  console.log(response);

  return response;
}

export function fetchHomeOverview(): Promise<HomeResponse> {
  return fetch(`${Config.RemBaseUrl}/query/home/overview`).then((e) =>
    e.json()
  );
}

export interface ListItem {
  id: string;
  name: string;
}

export interface ClusterViewResponse {
  cluster: Cluster;

  lists: {
    indexMethods: ListItem[];
    financialStatements: ListItem[];
    strategies: ListItem[];
  };
}

export function fetchCluster(
  id: string,
  processId: string
): Promise<ClusterViewResponse> {
  return get(`query/process/cluster?processId=${processId}&id=${id || ""}`);
}

export interface UpsertClusterCommand {
  processId: string;
  cluster: Cluster;
}

export async function upsertCluster(command: UpsertClusterCommand) {
  const result = await post("command/process/upsertcluster", command);
  command.cluster.id = result.newId;
}

export function fetchCountryDefaults() {
  return get("query/defaults/countrydefaults");
}

export function fetchSectorDefaults() {
  return get("query/defaults/sectordefaults");
}

function post(path: string, data: any) {
  return fetch(`${Config.RemBaseUrl}/${path}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((e) => e.json());
}

function get(path: string) {
  return fetch(`${Config.RemBaseUrl}/${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  }).then((e) => e.json());
}
