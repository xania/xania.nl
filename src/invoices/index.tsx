import { Company, Invoice } from "../azure-functions";
import { PageHeader } from "../layout/page/header";
import { Page, PageContent } from "../layout/page";
import { jsxFactory } from "@xania/view";
import { EventContext } from "../../view/lib/jsx2/element";

interface InvoiceDraftConfig {
  recipients: string[];
  bcc?: string[];
  subject: string;
  bodyLines: string[];
  invoiceFilename: string;
  timesheetFilename?: string;
  timesheetPdfUrl?: string;
}

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
    invoice2026080(),
    invoice2026081(),
    invoice2026082(),
  ].reverse();

  return (
    <Page>
      <PageHeader title="Invoices" backUrl="/" />
      <PageContent>{invoices.map(invoiceLink)}</PageContent>
    </Page>
  );
}

function invoiceLink(invoice: Invoice) {
  const draftConfig = getDraftConfig(invoice);

  return (
    <a class="mdc-card mdc-ripple-surface">
      <div class="mdc-card__content">
        <h2 class="mdc-typography mdc-typography--headline6">
          {invoice.number}
        </h2>
        <h3 class="mdc-typography mdc-typography--subtitle2">
          {invoice.creationDate}
        </h3>
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
        <button
          click={onDraftEmail}
          class="mdc-button mdc-card__action mdc-card__action--button mdc-ripple-upgraded"
        >
          <span class="mdc-button__label">Draft Email</span>
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

  async function onDraftEmail(e: EventContext<any, any>) {
    const button = e.node as HTMLButtonElement | undefined;
    const label = button?.querySelector(".mdc-button__label");
    const previous = label?.textContent || "Draft Email";

    try {
      if (button) {
        button.disabled = true;
      }
      if (label) {
        label.textContent = "Creating...";
      }

      const { createInvoiceDraft } = await import("../gmail-draft");
      const draft = await createInvoiceDraft(invoice, draftConfig);

      alert(
        `Gmail draft created. Open Gmail Drafts to review it. Draft id: ${
          draft.id || "unknown"
        }`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      alert(`Failed to create Gmail draft: ${message}`);
    } finally {
      if (button) {
        button.disabled = false;
      }
      if (label) {
        label.textContent = previous;
      }
    }
  }
}

function getDraftConfig(invoice: Invoice): InvoiceDraftConfig {
  const timesheet = timesheetAttachment(invoice.number);
  const subject = `Invoice ${invoice.description}`;
  const totalAmount = formatInvoiceTotal(invoice);
  const dueDate = formatDueDate(invoice);
  const bodyLines = [
    "Hi Rens,",
    "",
    timesheet
      ? `Please find attached the invoice and timesheet for ${invoice.description}.`
      : `Please find attached the invoice for ${invoice.description}.`,
    "",
    `- Invoice ${invoice.number} - ${invoice.description}`,
    `- Total amount: ${totalAmount}`,
    `- Due date: ${dueDate}`,
    "",
    "Kind regards,",
    "Ibrahim",
  ];

  return {
    recipients: [
      "rens.de.deugd@magnitglobal.com",
      "apukgeneral@magnitglobal.com",
    ],
    bcc: ["1309036herken@e-boekhouden.nl"],
    subject,
    bodyLines,
    invoiceFilename: `Factuur ${invoice.number}.pdf`,
    timesheetFilename: timesheet?.filename,
    timesheetPdfUrl: timesheet?.url,
  };
}

function timesheetAttachment(invoiceNumber: string) {
  if (invoiceNumber === "2026082") {
    return {
      filename: "Timesheet March 2026.pdf",
      url: "/google-docs-export/document/d/13YqKa-vWZ0aYNhfGi-ypB9ohZqA4DudB/export?format=pdf",
    };
  }

  if (invoiceNumber === "2026081") {
    return {
      filename: "Timesheet Feb 2026.pdf",
      url: "/google-docs-export/document/d/1LiErOjScgcbbxm9XA2lGLlrivB_y9V5x/export?format=pdf",
    };
  }
}

function formatInvoiceTotal(invoice: Invoice) {
  const subtotal = (invoice.lines || []).reduce(
    (sum, line) => sum + Number(line.amount || 0),
    0,
  );
  const tax = (invoice.lines || []).reduce(
    (sum, line) => sum + Number(line.amount || 0) * Number(line.tax || 0),
    0,
  );

  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(subtotal + tax);
}

function formatDueDate(invoice: Invoice) {
  const base = new Date(invoice.creationDate);
  base.setDate(base.getDate() + Number(invoice.expirationDays || 0));

  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(base);
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
    creationDate: "2023-08-02",
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
    creationDate: "2023-09-23",
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
    creationDate: "2023-10-26",
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
    creationDate: "2023-12-31",
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
    creationDate: "2023-12-31",
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
    creationDate: "2024-04-01",
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
    creationDate: "2024-04-01",
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
    creationDate: "2024-04-01",
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
    creationDate: "2024-04-01",
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
    creationDate: "2024-05-05",
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
    creationDate: "2024-06-02",
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
    creationDate: "2024-07-14",
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
    creationDate: "2024-08-10",
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
    creationDate: "2024-09-01",
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
    creationDate: "2024-10-09",
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
    creationDate: "2024-11-01",
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
    creationDate: "2024-12-12",
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
    creationDate: "2024-12-27",
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
    creationDate: "2025-02-10",
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
    creationDate: "2025-03-03",
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
    creationDate: "2025-04-01",
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
    creationDate: "2025-05-27",
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
    creationDate: "2025-06-01",
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
    creationDate: "2025-07-05",
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
    creationDate: "2025-07-05",
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
    creationDate: "2025-07-05",
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
    creationDate: "2026-01-14",
    description: "Dec 2025",
    lines: [magnitLine("Software Development", 120, 92.5)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}

function invoice2026080(): Invoice {
  return {
    number: "2026080",
    creationDate: "2026-03-29",
    description: "Jan 2026",
    lines: [magnitLine("Lead Developer", 120, 92.5)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}

function invoice2026081(): Invoice {
  return {
    number: "2026081",
    creationDate: "2026-03-29",
    description: "Feb 2026",
    lines: [magnitLine("Lead Developer", 115, 92.5)],
    expirationDays: 30,
    company: magnit,
    sender: xania,
  };
}

function invoice2026082(): Invoice {
  return {
    number: "2026082",
    creationDate: "2026-04-01",
    description: "March 2026",
    lines: [magnitLine("Lead Developer", 120.5, 92.5)],
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
