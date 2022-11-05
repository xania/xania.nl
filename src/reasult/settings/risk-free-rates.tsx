import { jsxFactory } from "@xania/view";
import { PageHeader } from "../../layout/page/header";
import { Page, PageContent } from "../../layout/page";
import { RouteContext } from "../../router/outlet2";
import { fetchCountryDefaults, fetchSectorDefaults } from "../functions";

const jsx = jsxFactory({});
export async function RiskFreeRatesView(context: RouteContext) {
  const countryDefaults = await fetchCountryDefaults();
  const sectorDefaults = await fetchSectorDefaults();
  console.log(sectorDefaults);
  console.log(countryDefaults);
  return {
    get view() {
      return (
        <Page>
          <PageHeader title="Risk Free Rates" />
          <PageContent></PageContent>
        </Page>
      );
    },
  };
}
