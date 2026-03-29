import { Company, Invoice } from "../azure-functions";
import { PageHeader } from "../layout/page/header";
import { Page, PageContent } from "../layout/page";
import { jsxFactory } from "@xania/view";

const jsx = jsxFactory();

export function InvoiceApp() {
  var invoices: Invoice[] = [
    invoice2023053(),
    invoice2023054(),
    invoice2023055(),
    invoice2023056(),
    invoice2023057(),
    invoice2024058(),
    invoice2024059(),
    invoice2024060(),
    invoice2024061(),
    invoice2024062(),
    invoice2024063(),
    invoice2024064(),
    invoice2024065(),
    invoice2024066(),
    invoice2024067(),
    invoice2024068(),
    invoice2024069(),
    invoice2024070(),
    invoice2024071(),
    invoice2025072(),
    invoice2025073(),
    invoice2025074(),
    invoice2025075(),
    invoice2025076(),
    invoice2025077(),
    invoice2025078(),
    invoice2025079(),
  ].reverse();

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
    const { renderInvoicePdf } = await import("./render-pdf");
    const blob = await renderInvoicePdf(invoice);
    const url = window.URL.createObjectURL(blob);

    var link = document.createElement("a");
    link.href = url;
    link.download = `Factuur ${invoice.number}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}

const magnit: Company = {
  name: "Magnit Global Netherlands BN B.V.",
  addressLines: [
    "apukgeneral@magnitglobal.com",
    "Marconibaan 1a",
    "3439 MR Nieuwegein",
  ],
};

const xania: Sender = {
  bankAccount: "NL61 INGB 0005 8455 00",
  name: "Xania Software",
};

interface Sender {
  bankAccount: string;
  name: string;
}

function invoice2023053(): Invoice {
  return {
    number: "2023053",
    date: "2023-08-02",
    description: "July 2023",
    lines: [magnitLine("Lead Developer", 82)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}

function invoice2023054(): Invoice {
  return {
    number: "2023054",
    date: "2023-09-23",
    description: "Aug 2023",
    lines: [magnitLine("Lead Developer", 23 * 8)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}

function invoice2023055(): Invoice {
  return {
    number: "2023055",
    date: "2023-10-26",
    description: "Sept 2023",
    lines: [magnitLine("Lead Developer", 21 * 8)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}
function invoice2023056(): Invoice {
  return {
    number: "2023056",
    date: "2023-12-31",
    description: "Okt 2023",
    lines: [magnitLine("Lead Developer", 178)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}
function invoice2023057(): Invoice {
  return {
    number: "2023057",
    date: "2023-12-31",
    description: "Nov 2023",
    lines: [magnitLine("Lead Developer", 186)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}
function invoice2024058(): Invoice {
  return {
    number: "2024059",
    date: "2024-04-01",
    description: "Dec 2023",
    lines: [magnitLine("Lead Developer", 140)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}
function invoice2024059(): Invoice {
  return {
    number: "2024059",
    date: "2024-04-01",
    description: "Jan 2024",
    lines: [magnitLine("Lead Developer", 183)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}
function invoice2024060(): Invoice {
  return {
    number: "2024060",
    date: "2024-04-01",
    description: "Feb 2024",
    lines: [magnitLine("Lead Developer", 179)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}
function invoice2024061(): Invoice {
  return {
    number: "2024061",
    date: "2024-04-01",
    description: "Mrt 2024",
    lines: [magnitLine("Lead Developer", 183)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}
function invoice2024062(): Invoice {
  return {
    number: "2024062",
    date: "2024-05-05",
    description: "Apr 2024",
    lines: [magnitLine("Lead Developer", 164)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}
function invoice2024063(): Invoice {
  return {
    number: "2024063",
    date: "2024-06-02",
    description: "May 2024",
    lines: [magnitLine("Lead Developer", 127)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}
function invoice2024064(): Invoice {
  return {
    number: "2024064",
    date: "2024-07-14",
    description: "Jun 2024",
    lines: [magnitLine("Lead Developer", 3 * 40 + 1 + 1 + 4 + 1 + 4)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}
function invoice2024065(): Invoice {
  return {
    number: "2024065",
    date: "2024-08-10",
    description: "Jul 2024",
    lines: [magnitLine("Lead Developer", 186)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}
function invoice2024066(): Invoice {
  return {
    number: "2024066",
    date: "2024-09-01",
    description: "Aug 2024",
    lines: [magnitLine("Lead Developer", 81)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}
function invoice2024067(): Invoice {
  return {
    number: "2024067",
    date: "2024-10-09",
    description: "Sept 2024",
    lines: [magnitLine("Lead Developer", 176)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}

function invoice2024068(): Invoice {
  return {
    number: "2024068",
    date: "2024-11-01",
    description: "Oct 2024",
    lines: [magnitLine("Lead Developer", 204, 87.5)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}

function invoice2024069(): Invoice {
  return {
    number: "2024069",
    date: "2024-12-12",
    description: "Nov 2024",
    lines: [magnitLine("Lead Developer", 168, 87.5)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}

function invoice2024070(): Invoice {
  return {
    number: "2024070",
    date: "2024-12-27",
    description: "Dec 2024",
    lines: [magnitLine("Lead Developer", 152, 90)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}

function invoice2024071(): Invoice {
  return {
    number: "2024071",
    date: "2025-02-10",
    description: "Jan 2025",
    lines: [magnitLine("Lead Developer", 186, 90)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}

function invoice2025072(): Invoice {
  return {
    number: "2025072",
    date: "2025-03-03",
    description: "Feb 2025",
    lines: [magnitLine("Lead Developer", 163, 90)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}

function invoice2025073(): Invoice {
  return {
    number: "2025073",
    date: "2025-04-01",
    description: "March 2025",
    lines: [magnitLine("Lead Developer", 170.5, 92.5)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}

function invoice2025074(): Invoice {
  return {
    number: "2025074",
    date: "2025-05-27",
    description: "April 2025",
    lines: [magnitLine("Lead Developer", 160, 92.5)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}

function invoice2025075(): Invoice {
  return {
    number: "2025075",
    date: "2025-06-01",
    description: "May 2025",
    lines: [magnitLine("Lead Developer", 166, 92.5)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}

function invoice2025076(): Invoice {
  return {
    number: "2025076",
    date: "2025-07-05",
    description: "Jun 2025",
    lines: [magnitLine("Lead Developer", 173, 92.5)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}

function invoice2025077(): Invoice {
  return {
    number: "2025077",
    date: "2025-07-05",
    description: "Jul-Oct 2025",
    lines: [
      magnitLine("Jul", 152, 92.5),
      magnitLine("Aug", 88, 92.5),
      magnitLine("Sept", 164, 92.5),
      magnitLine("Oct", 157, 92.5),
    ],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}

function invoice2025078(): Invoice {
  return {
    number: "2025078",
    date: "2025-07-05",
    description: "Nov 2025",
    lines: [magnitLine("Nov", 142, 92.5)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}

function invoice2025079(): Invoice {
  return {
    number: "2025079",
    date: "2026-01-14",
    description: "Dec 2025",
    lines: [magnitLine("Software Development", 120, 92.5)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}

function magnitLine(description: string, hours: number, rate: number = 85) {
  return {
    tax: 0.21,
    description,
    hours,
    amount: hours * rate,
  } as any;
}
