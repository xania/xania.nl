import { Company, Invoice, XaniaClient } from "../azure-functions";
import { PageHeader } from "../layout/page/header";
import { Page, PageContent } from "../layout/page";
import { jsxFactory } from "@xania/view";

const jsx = jsxFactory();

export function InvoiceApp() {
  var invoices: Invoice[] = [
    invoice2017056(),
    invoice2017055(),
    invoice2017054(),
    invoice2017053(),
  ];

  return (
    <Page>
      <PageHeader title="Invoices" backUrl="/" />
      <PageContent>{invoices.map(invoiceLink)}</PageContent>
    </Page>
  );
}

function invoiceLink(invoice: Invoice) {
  return (
    <a class="mdc-card mdc-ripple-surface">
      <div class="mdc-card__content">
        <h2 class="mdc-typography mdc-typography--headline6">
          {invoice.number}
        </h2>
        <h3 class="mdc-typography mdc-typography--subtitle2">{invoice.date}</h3>
        <div class="demo-card__supporting-text">{invoice.description}</div>
      </div>
      <div class="mdc-card__actions">
        <button
          click={onDownload}
          class="mdc-button mdc-card__action mdc-card__action--button mdc-ripple-upgraded"
        >
          <span class="mdc-button__label">Download</span>
          <div class="mdc-button__ripple"></div>
        </button>
      </div>
    </a>
  );

  async function onDownload() {
    const client = new XaniaClient({ baseUrl: null });
    const resp = await client.api.invoiceCreate(invoice);

    const url = window.URL.createObjectURL(resp.data);

    var link = document.createElement("a");
    link.href = url;
    link.download = `Factuur ${invoice.number}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}

const multiplied: Company = {
  name: "Multiplied Midden Nederland B.V.",
  addressLines: ["Matthew David Agteres", "Galvanistraat 1", "6716 AE Ede"],
};

const xania: Sender = {
  bankAccount: "NL61 INGB 0005 8455 00",
  name: "Xania Software",
};

interface Sender {
  bankAccount: string;
  name: string;
}

function invoice2017054(): Invoice {
  return {
    number: "2017054",
    date: "2022-10-01",
    description: "Periode Sept 2022",
    lines: [reasultLine("Inzet Reasult BV", 176)],
    expirationDays: 30,
    company: multiplied,
    sender: xania,
  };
}

function invoice2017056(): Invoice {
  return {
    number: "2017056",
    date: "2022-12-15",
    description: "Periode Nov 2022",
    lines: [reasultLine("Inzet Reasult BV", 176)],
    expirationDays: 30,
    company: multiplied,
    sender: xania,
  };
}

function invoice2017055(): Invoice {
  return {
    number: "2017055",
    date: "2022-11-01",
    description: "Periode Okt 2022",
    lines: [reasultLine("Inzet Reasult BV", 160)],
    expirationDays: 30,
    company: multiplied,
    sender: xania,
  };
}

function invoice2017053(): Invoice {
  return {
    number: "2017053",
    date: "2022-09-11",
    description: "Periode Aug 2022",
    lines: [reasultLine("Inzet Reasult BV", 60)],
    expirationDays: 30,
    company: multiplied,
    sender: xania,
  };
}

function reasultLine(description: string, hours: number) {
  return {
    tax: 0.21,
    description,
    hours,
    amount: hours * 97,
  } as any;
}
