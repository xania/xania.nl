import * as jsx from "@xania/view";
import { XaniaClient } from "../azure-functions";

import "./style.scss";

export function InvoiceApp() {
  var invoices: Invoice[] = [invoice2017053(), invoice2017054()];

  return <section>{invoices.map(invoiceLink)}</section>;
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
    const blob = await client.api.invoiceCreate(invoice).then((e) => e.blob());

    const url = window.URL.createObjectURL(blob);

    var link = document.createElement("a");
    link.href = url;
    link.download = `Factuur ${invoice.number}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}

const multiplied: Company = {
  name: "Multiplied Midden Nederland B.V.",
  addressLines: ["Matthew David Agteres"],
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
    date: "2022-10-09",
    description: "Periode Sept 2022",
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
  };
}

interface InvoiceLine {
  description: string;
  hours: number;
  amount: number;
}

interface Invoice {
  number: string;
  date: string;
  description: string;
  lines: InvoiceLine[];
  expirationDays: number;
  company: Company;
  sender: Sender;
}

interface Company {
  name: string;
  addressLines: string[];
}

interface Address {
  contactName?: string;
  phone?: string;
  email?: string;
  street?: string;
  nr?: string;
  nrExtra?: string;
  zipCode?: string;
  city?: string;
  state?: string;
}
