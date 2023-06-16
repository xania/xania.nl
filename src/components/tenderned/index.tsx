import { Page } from "~/layout/page";

export async function TenderNed() {
  // https://www.tenderned.nl/papi/tenderned-rs-tns/v2/publicaties?page=0&size=50&publicatieDatumPreset=AF30

  const map = new Map<string, { publicatie: Publicatie; count: number }>();

  const ids = await reduce((acc, publicatie) => {
    if (publicatie.cpvCodes instanceof Array) {
      for (const cpv of publicatie.cpvCodes) {
        const info = acc.get(cpv.code);

        if (info === undefined) {
          acc.set(cpv.code, {
            publicatie,
            count: 1,
          });
        } else {
          info.count++;
          acc.set(cpv.code, info);
        }
      }
    } else {
      console.error(publicatie.cpvCodes);
    }
  }, map);

  const sorted = [...ids.values()].sort((x, y) => x.count - y.count);
  console.log(sorted);

  return (
    <Page>
      <div>asdfasdf</div>
    </Page>
  );
}

async function reduce<TAcc>(f: (acc: TAcc, p: Publicatie) => any, acc: TAcc) {
  const files = import.meta.glob("./data/*.json");
  for (const path in files) {
    const mod = (await files[path]()) as { default: Publicatie };

    f(acc, mod.default);
  }

  return acc;
}

interface Publicatie {
  cpvCodes: {
    code: string;
    isHoofdOpdracht: boolean;
    omschrijving: string;
  }[];
}

// 'Betreft een marktconsultatie waarin de markt gevraagd wordt om mee te denken met onze sector Veilig en Gezond Werken die naar een Informatievoorzieningssysteem ter ondersteuning van VGW-processen zoekt.'
