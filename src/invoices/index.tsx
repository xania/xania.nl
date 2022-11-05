import * as jsx from "@xania/view";
import { Company, Invoice, XaniaClient } from "../azure-functions";
import { PageHeader } from "../layout/page/header";
import { Page } from "../layout/page";

import "./style.scss";

export function InvoiceApp() {
  var invoices: Invoice[] = [
    invoice2017053(),
    invoice2017054(),
    invoice2017055(),
  ];

  return (
    <Page>
      <PageHeader title="Invoices" backUrl="/" />
      <section>{invoices.map(invoiceLink)}</section>
    </Page>
  );
}

function invoiceLink(invoice: Invoice) {
  return (
    <div class="mdc-card demo-card">
      <div class="demo-card__primary">
        <h2 class="mdc-typography mdc-typography--headline6">
          {invoice.number}
        </h2>
        <h3 class="mdc-typography mdc-typography--subtitle2">{invoice.date}</h3>
      </div>
      <div class="mdc-card-wrapper__text-section">
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
    </div>
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
