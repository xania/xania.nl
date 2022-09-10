import * as jsx from "@xania/view";
import { render } from "@xania/view";

export function InvoiceApp() {
  var invoices: Invoice[] = [invoice2017053(), invoice2017054()];

  return <section>{invoices.map(invoiceLink)}</section>;
}

render(<InvoiceApp />, "#app");

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

  function onDownload() {
    console.log(invoice);
  }
}

function invoice2017053(): Invoice {
  return {
    number: "2017053",
    date: "2022-10-09",
    description: "Periode Aug 2022",
    lines: [reasultLine("Inzet Reasult BV", 160)],
  };
}

function invoice2017054(): Invoice {
  return {
    number: "2017054",
    date: "2022-11-01",
    description: "Periode Okt 2022",
    lines: [reasultLine("Inzet Reasult BV", 8 * 8)],
  };
}

function reasultLine(description: string, hours: number) {
  return {
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
}
