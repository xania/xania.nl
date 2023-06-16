import { Page } from "~/layout/page";
import { Header } from "~/layout/title";

export function Relations() {
  return (
    <>
      <Page>
        <Header close>Relations</Header>
        <div>
          <li>
            <li>Naam</li>
            <li>Contact</li>
            <li>Branche</li>
            <li>Regio</li>
            <li>Website</li>
            <li>Account Manager</li>
          </li>

          <div>
            General, Adres, Route, Relatie, Vestiging, Contactpersonen,
            Financieel, Incasso, Offerte, Project, Factuur, Archief, Opmerkingen
          </div>
        </div>
      </Page>
    </>
  );
}
