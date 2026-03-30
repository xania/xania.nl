import { Invoice } from "./azure-functions";
import { renderInvoicePdf } from "./invoices/render-pdf";

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient(config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }): {
            requestAccessToken(options?: { prompt?: string }): void;
          };
        };
      };
    };
  }
}

const clientId =
  "522390940637-co8ellugea55m09isgsthe20qr9lnbto.apps.googleusercontent.com";
const composeScope = "https://www.googleapis.com/auth/gmail.compose";

export interface InvoiceDraftOptions {
  recipients: string[];
  bcc?: string[];
  subject: string;
  bodyLines: string[];
  invoiceFilename: string;
  timesheetFilename?: string;
  timesheetPdfUrl?: string;
}

export async function createInvoiceDraft(
  invoice: Invoice,
  options: InvoiceDraftOptions,
) {
  await ensureGoogleScript();
  const token = await getAccessToken();
  const invoicePdf = await renderInvoicePdf(invoice);

  const attachments = [
    {
      name: options.invoiceFilename,
      type: "application/pdf",
      content: await blobToBase64(invoicePdf),
    },
  ];

  if (options.timesheetPdfUrl && options.timesheetFilename) {
    const timesheetPdf = await fetch(options.timesheetPdfUrl)
      .then(requireOk)
      .then((res) => res.blob());

    attachments.push({
      name: options.timesheetFilename,
      type: "application/pdf",
      content: await blobToBase64(timesheetPdf),
    });
  }

  const raw = await buildMimeMessage({
    recipients: options.recipients,
    bcc: options.bcc,
    subject: options.subject,
    bodyLines: options.bodyLines,
    attachments,
  });

  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/drafts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: {
        raw,
      },
    }),
  }).then(requireOk);

  return response.json();
}

function getAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const google = window.google;
    if (!google) {
      reject(new Error("Google Identity script is not loaded yet."));
      return;
    }

    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: composeScope,
      callback(response) {
        if (response.error || !response.access_token) {
          reject(new Error(response.error || "Google sign-in failed."));
          return;
        }

        resolve(response.access_token);
      },
    });

    tokenClient.requestAccessToken({ prompt: "consent" });
  });
}

async function ensureGoogleScript() {
  if (window.google) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    ) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google Identity Services.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Google Identity Services."));
    document.head.appendChild(script);
  });
}

async function buildMimeMessage(options: {
  recipients: string[];
  bcc?: string[];
  subject: string;
  bodyLines: string[];
  attachments: Array<{ name: string; type: string; content: string }>;
}) {
  const boundary = `xania-${Date.now()}`;
  const message = [
    `To: ${options.recipients.join(", ")}`,
    ...(options.bcc && options.bcc.length ? [`Bcc: ${options.bcc.join(", ")}`] : []),
    `Subject: ${options.subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
    "",
    options.bodyLines.join("\r\n"),
    "",
    ...options.attachments.flatMap((attachment) => [
      `--${boundary}`,
      `Content-Type: ${attachment.type}; name="${attachment.name}"`,
      "Content-Transfer-Encoding: base64",
      `Content-Disposition: attachment; filename="${attachment.name}"`,
      "",
      wrapBase64(attachment.content),
      "",
    ]),
    `--${boundary}--`,
  ].join("\r\n");

  return toBase64Url(new TextEncoder().encode(message));
}

function wrapBase64(value: string) {
  const chunks: string[] = [];
  for (let index = 0; index < value.length; index += 76) {
    chunks.push(value.slice(index, index + 76));
  }

  return chunks.join("\r\n");
}

async function blobToBase64(blob: Blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary);
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function requireOk(response: Response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response;
}

const button = document.querySelector<HTMLButtonElement>("#create-draft");
const status = document.querySelector<HTMLElement>("#status");

if (button && status) {
  button.addEventListener("click", () => {
    void createInvoiceDraft(
      getMarchInvoice(),
      getMarchDraftOptions(),
    )
      .then((draft) => {
        status.textContent =
          `Draft created. Open Gmail Drafts to review it. Draft id: ${draft.id || "unknown"}`;
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : String(error);
        status.textContent = `Failed: ${message}`;
      });
  });
}

function getMarchInvoice(): Invoice {
  return {
    number: "2026082",
    creationDate: "2026-04-01",
    description: "March 2026",
    lines: [
      {
        description: "Lead Developer",
        hours: 120.5,
        tax: 0.21,
        amount: 120.5 * 92.5,
      },
    ],
    expirationDays: 30,
    company: {
      name: "Magnit Global Netherlands BN B.V.",
      addressLines: [
        "apukgeneral@magnitglobal.com",
        "Marconibaan 1a",
        "3439 MR Nieuwegein",
      ],
    },
    sender: {
      bankAccount: "NL61 INGB 0005 8455 00",
      name: "Xania Software",
    },
  };
}

function getMarchDraftOptions(): InvoiceDraftOptions {
  return {
    recipients: [
      "rens.de.deugd@magnitglobal.com",
      "apukgeneral@magnitglobal.com",
    ],
    bcc: ["1309036herken@e-boekhouden.nl"],
    subject: "Invoice March 2026",
    bodyLines: [
      "Hi Rens,",
      "",
      "Please find attached the invoice and timesheet for March 2026.",
      "",
      "- Invoice 2026082 - March 2026",
      "",
      "Kind regards,",
      "Ibrahim",
    ],
    invoiceFilename: "Factuur 2026082.pdf",
    timesheetFilename: "Timesheet March 2026.pdf",
    timesheetPdfUrl:
      "/google-docs-export/document/d/13YqKa-vWZ0aYNhfGi-ypB9ohZqA4DudB/export?format=pdf",
  };
}
