import { useState } from "xania";
import { Page } from "~/layout/page";
import { Header } from "~/layout/title";

export function Incasso() {
  return (
    <>
      <Page>
        <Header>Incasso</Header>
        <p class="sm:w-72 sm:p-4">
          Stuur ons uw factuur en wij regelen de rest met de klant om te zorgen
          dat de facturen op een correcte manier betaald kunnen worden.
        </p>
        <p class="sm:w-72 sm:p-4">
          Betaalt klant niet? dan u ook niet. Mocht het nodig zijn om de
          rechtbank in te schakelen dan kunnen wij u erbij adviseren en
          ondersteunen, zonder gedoe.
        </p>
      </Page>
      <Page>
        <Form />
      </Page>
    </>
  );
}

function Form() {
  return (
    <div class="p-6">
      <div class="border-2 border-solid border-gray-300 p-10">
        Upload je factuur
      </div>
      <div>
        Particulier of bedrijf
        <input type="checkbox"></input>
        <div>
          Bedrag
          <input type=""></input>
        </div>
      </div>
      <hr class="my-4 border-gray-600" />
      <div>
        <h4>Mijn gegevens</h4>
        <div>Bedrijf:</div>
        <div>Naam:</div>
        <div>E-mail:</div>
        <div>Telefoon:</div>
        <div>Toelichting:</div>
        <div>Akkoord</div>
      </div>
    </div>
  );
}
