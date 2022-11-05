import { Page, PageContent } from "../../layout/page";
import { jsxFactory } from "@xania/view";
import { PageHeader } from "../../layout/page/header";
import { route } from "../../router/route-resolver";
import { MDCRipple } from "@material/ripple";
import { regex } from "../../router/matchers";
import { Config } from "../api/config";
import { RouteContext } from "../../router/outlet2";
import { RiskFreeRatesView } from "./risk-free-rates";

const jsx = jsxFactory({});

export async function SettingsView(context: RouteContext) {
  return {
    get view() {
      return (
        <Page>
          <PageHeader title="Settings" />
          <PageContent>
            <a href={context.url + "/risk-free-rates"}>Risk free rates</a>
            <button
              click={createTestData}
              class="mdc-button mdc-button--raised"
            >
              Seed data
            </button>
            <a
              href="/reasult/settings/tax-schemes"
              class="mdc-button mdc-button--raised router-link"
            >
              Tax Schemes
            </a>
          </PageContent>
        </Page>
      );
    },
    routes: [
      route(["tax-schemes"], TaxSchemeListView),
      route(["risk-free-rates"], RiskFreeRatesView),
    ],
  };
}

async function TaxSchemeListView() {
  const response = await fetchTaxSchemes();
  return {
    get view() {
      return (
        <Page>
          <PageHeader title="Tax Shemes" />
          <PageContent>
            <div class="mdc-list">
              {response.realEstateTransferTaxSchemes.map((rett, i) => (
                <a
                  href={`/reasult/settings/tax-schemes/${rett.id}`}
                  class="mdc-list-item mdc-list-item--with-one-line router-link mdc-ripple-surface"
                >
                  <span class="mdc-list-item__content">{rett.taxScheme}</span>
                  {MDCRipple}
                </a>
              ))}
            </div>
          </PageContent>
        </Page>
      );
    },
    routes: [
      route(regex(/(?<id>.+)/), (params) => <TaxSchemeView id={params.id} />),
    ],
  };
}

interface TaxSchemeViewProps {
  id: string;
}

async function TaxSchemeView(props: TaxSchemeViewProps) {
  const response = await fetchRealEstateTaxScheme(props.id);
  var scheme = response.realEstateTransferTaxScheme;
  console.log(scheme);
  return {
    get view() {
      return (
        <Page>
          <PageHeader title={scheme.taxScheme} />
          <PageContent>
            <button click={addRate} class="mdc-button--raised">
              add rate
            </button>
            <div>
              {scheme.periods.map((e) => (
                <PeriodListItemView period={e} />
              ))}
            </div>
          </PageContent>
        </Page>
      );
    },
  };

  function addRate() {
    for (const period of scheme.periods) {
      period.rates.push({
        rate: 0.11,
        valueFrom: 10,
        valueTo: null,
      });
    }

    updateRealEstateTaxScheme({
      id: scheme.id,
      countryId: scheme.countryId,
      taxScheme: scheme.taxScheme,
      periods: scheme.periods.map((p) => ({
        startDate: p.startDate,
        cumulative: p.cumulative,
        rates: p.rates.map((r) => ({
          valueFrom: r.valueFrom,
          rate: r.rate,
        })),
      })),
      status: EntityStatus.Active,
    });
  }

  function PeriodListItemView(props: { period: RealEstateTaxSchemePeriod }) {
    const { period } = props;
    return (
      <div>
        <div>
          [ startDate: {period.startDate} - endDate: {period.endDate} &gt;
        </div>
        {period.rates.map((r) => (
          <div>
            [{r.valueFrom}, {r.valueTo}&gt; {r.rate}
          </div>
        ))}
      </div>
    );
  }
}

interface RealEstateTaxSchemesResponse {
  realEstateTransferTaxSchemes: {
    id: string;
    taxScheme: string;
  }[];
}

type RealEstateTaxSchemePeriod =
  RealEstateTaxSchemeResponse["realEstateTransferTaxScheme"]["periods"][number];

interface RealEstateTaxSchemeResponse {
  realEstateTransferTaxScheme: {
    id: string;
    taxScheme: string;
    countryId: string;
    periods: {
      cumulative: boolean;
      endDate: string | null;
      startDate: string | null;
      rates: {
        rate: number;
        valueFrom: number;
        valueTo: number | null;
      }[];
    }[];
  };
}

async function fetchRealEstateTaxScheme(id) {
  return fetch(
    `${Config.RemBaseUrl}/query/defaults/RealEstateTransferTaxScheme?id=${id}`
  ).then((e) => e.json()) as Promise<RealEstateTaxSchemeResponse>;
}

interface UpdateRealEstateTaxSchemeCommand {
  id: string;
  countryId: string;
  taxScheme: string;
  periods: {
    startDate: string;
    cumulative: boolean;
    rates: {
      valueFrom: number;
      rate: number;
    }[];
  }[];
  status: EntityStatus;
}
async function updateRealEstateTaxScheme(
  command: UpdateRealEstateTaxSchemeCommand
) {
  console.log("updating...", command);
  return fetch(
    `${Config.RemBaseUrl}/command/Defaults/UpdateRealEstateTransferTaxScheme`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    }
  );
}

async function fetchTaxSchemes(): Promise<RealEstateTaxSchemesResponse> {
  return fetch(
    `${Config.RemBaseUrl}/query/defaults/RealEstateTransferTaxSchemes`
  ).then((e) => e.json());
}

async function createTestData() {
  await fetch(`${Config.RemBaseUrl}/command/data/createtestdata`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      numberOfAssets: 2,
      numberOfProperties: 2,
      numberOfRentableUnits: 2,
      numberOfContracts: 2,
    }),
  });
  window.alert("done.");
}

enum EntityStatus {
  Active = 1,
  Inactive = 2,
}
