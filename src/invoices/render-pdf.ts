import * as fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Invoice, InvoiceLine } from "../azure-functions";

const fontkitInstance: any = (fontkit as any).default || fontkit;

const logoUrl = new URL(
  "../../dotnet-functions/Invoices/logo.PNG",
  import.meta.url,
).href;
const footerUrl = new URL(
  "../../dotnet-functions/Invoices/blue.PNG",
  import.meta.url,
).href;
const fontUrl = new URL(
  "../../dotnet-functions/Invoices/roboto.regular.ttf",
  import.meta.url,
).href;

const euro = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
});

const dutchDate = new Intl.DateTimeFormat("nl-NL", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

let assetsPromise:
  | Promise<{
      logo: Uint8Array;
      footer: Uint8Array;
      font: Uint8Array;
    }>
  | undefined;

export async function renderInvoicePdf(invoice: Invoice): Promise<Blob> {
  const [assets, normalized] = await Promise.all([
    loadAssets(),
    Promise.resolve(normalizeInvoice(invoice)),
  ]);

  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkitInstance);

  const page = pdf.addPage([595.28, 841.89]);
  const font = await pdf.embedFont(assets.font);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const logo = await pdf.embedPng(assets.logo);
  const footer = await pdf.embedPng(assets.footer);

  const left = 36;
  const top = page.getHeight() - 36;
  const width = page.getWidth() - 72;

  page.drawImage(logo, {
    x: left,
    y: top - 82,
    width: 82,
    height: (logo.height / logo.width) * 82,
  });

  drawText(page, bold, 16, "FACTUUR", left, top - 120, rgb(0.3, 0.3, 0.3));

  drawParagraph(
    page,
    font,
    10,
    [normalized.company.name, ...normalized.company.addressLines]
      .filter(Boolean)
      .join("\n"),
    left,
    top - 132,
    240,
    14,
    rgb(0.35, 0.35, 0.35),
  );

  const metaX = left + 334;
  const metaRows = [
    ["Factuur nr", normalized.number],
    ["Datum", formatDate(normalized.date)],
    [
      "Vervaldatum",
      formatDate(addDays(normalized.date, normalized.expirationDays)),
    ],
    ["Excl btw", formatMoney(normalized.totalAmountExclTax)],
    ["Btw", formatMoney(normalized.totalTax)],
    ["Totaal", formatMoney(normalized.totalAmountInclTax)],
  ];

  metaRows.forEach(([label, value], index) => {
    const y = top - 92 - index * 22;
    if (index === metaRows.length - 1) {
      page.drawRectangle({
        x: metaX - 8,
        y: y - 6,
        width: 196,
        height: 22,
        borderWidth: 1,
        borderColor: rgb(0.47, 0.47, 0.47),
      });
    }

    drawRightAlignedText(
      page,
      font,
      10,
      label,
      metaX,
      y,
      75,
      rgb(0.35, 0.35, 0.35),
    );
    drawText(
      page,
      font,
      10,
      String(value),
      metaX + 85,
      y,
      rgb(0.15, 0.15, 0.15),
    );
  });

  drawParagraph(
    page,
    font,
    11,
    normalized.description,
    left,
    top - 220,
    width,
    14,
    rgb(0.15, 0.15, 0.15),
  );

  const tableTop = top - 270;
  const descriptionWidth = 295;
  const hoursWidth = 78;
  const amountWidth = 82;
  const taxWidth = 68;

  drawTableFrame(page, left, tableTop, width, 24, [
    descriptionWidth,
    hoursWidth,
    amountWidth,
    taxWidth,
  ]);

  drawText(
    page,
    font,
    10,
    "Omschrijving",
    left + 10,
    tableTop - 16,
    rgb(0.15, 0.15, 0.15),
  );
  drawText(
    page,
    font,
    10,
    "Uren",
    left + descriptionWidth + 10,
    tableTop - 16,
    rgb(0.15, 0.15, 0.15),
  );
  drawText(
    page,
    font,
    10,
    "Bedrag",
    left + descriptionWidth + hoursWidth + 10,
    tableTop - 16,
    rgb(0.15, 0.15, 0.15),
  );
  drawText(
    page,
    font,
    10,
    "BTW",
    left + descriptionWidth + hoursWidth + amountWidth + 10,
    tableTop - 16,
    rgb(0.15, 0.15, 0.15),
  );

  normalized.lines.forEach((line, index) => {
    const y = tableTop - 44 - index * 24;
    drawText(
      page,
      font,
      10,
      line.description || "",
      left + 10,
      y + 7,
      rgb(0.15, 0.15, 0.15),
    );
    drawText(
      page,
      font,
      10,
      formatHours(line.hours),
      left + descriptionWidth + 10,
      y + 7,
      rgb(0.15, 0.15, 0.15),
    );
    drawText(
      page,
      font,
      10,
      formatMoney(line.amount),
      left + descriptionWidth + hoursWidth + 10,
      y + 7,
      rgb(0.15, 0.15, 0.15),
    );
    drawText(
      page,
      font,
      10,
      formatMoney(line.amount * line.tax),
      left + descriptionWidth + hoursWidth + amountWidth + 10,
      y + 7,
      rgb(0.15, 0.15, 0.15),
    );
  });

  const noticeY = tableTop - 44 - normalized.lines.length * 24 - 42;
  page.drawRectangle({
    x: left,
    y: noticeY,
    width,
    height: 52,
    color: rgb(0.88, 0.88, 0.94),
  });

  drawParagraph(
    page,
    font,
    10,
    `U wordt vriendelijk verzocht het bedrag van ${formatMoney(
      normalized.totalAmountInclTax,
    )} uiterlijk ${formatDate(
      addDays(normalized.date, normalized.expirationDays),
    )} over te maken op ${normalized.sender.bankAccount} ten name van ${
      normalized.sender.name
    }`,
    left + 10,
    noticeY + 40,
    width - 20,
    13,
    rgb(0.35, 0.35, 0.35),
  );

  page.drawImage(footer, {
    x: left,
    y: 24,
    width: 24,
    height: (footer.height / footer.width) * 24,
  });

  drawParagraph(
    page,
    font,
    9,
    `${normalized.sender.name} | Midwoudpad 18 1024 MC Amsterdam | ibrahim.bensalah@xania.nl\nIBAN: ${normalized.sender.bankAccount} | BTW: NL001613046B67 | KvK: 34236468`,
    left + 28,
    46,
    width - 50,
    11,
    rgb(0.2, 0.2, 0.2),
  );

  const bytes = await pdf.save();
  return new Blob([toArrayBuffer(bytes)], { type: "application/pdf" });
}

function normalizeInvoice(invoice: Invoice) {
  const lines = (invoice.lines || []).map(normalizeLine);
  const totalAmountExclTax = lines.reduce((sum, line) => sum + line.amount, 0);
  const totalTax = lines.reduce((sum, line) => sum + line.amount * line.tax, 0);

  return {
    ...invoice,
    number: invoice.number || "",
    description: invoice.description || "",
    date: invoice.date || new Date().toISOString().slice(0, 10),
    expirationDays: Number(invoice.expirationDays) || 30,
    company: {
      name: invoice.company?.name || "",
      addressLines: Array.isArray(invoice.company?.addressLines)
        ? invoice.company.addressLines
        : [],
    },
    sender: {
      name: invoice.sender?.name || "",
      bankAccount: invoice.sender?.bankAccount || "",
    },
    lines,
    totalAmountExclTax,
    totalTax,
    totalAmountInclTax: totalAmountExclTax + totalTax,
  };
}

function normalizeLine(line: InvoiceLine): InvoiceLine {
  return {
    description: line.description || "",
    hours: Number(line.hours) || 0,
    tax: Number(line.tax) || 0,
    amount: Number(line.amount) || 0,
  };
}

function drawText(page, font, size, text, x, y, color) {
  page.drawText(text, { x, y, size, font, color });
}

function drawRightAlignedText(page, font, size, text, x, y, width, color) {
  const textWidth = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: x + Math.max(0, width - textWidth),
    y,
    size,
    font,
    color,
  });
}

function drawParagraph(
  page,
  font,
  size,
  text,
  x,
  topY,
  width,
  lineHeight,
  color,
) {
  const lines = String(text)
    .split("\n")
    .flatMap((line) => wrapText(line, font, size, width));

  lines.forEach((line, index) => {
    page.drawText(line, {
      x,
      y: topY - size - index * lineHeight,
      size,
      font,
      color,
    });
  });
}

function wrapText(text, font, size, width) {
  if (!text) {
    return [""];
  }

  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= width || !current) {
      current = next;
      continue;
    }

    lines.push(current);
    current = word;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function drawTableFrame(page, x, top, width, height, columns) {
  page.drawRectangle({
    x,
    y: top - height,
    width,
    height,
    borderWidth: 1,
    borderColor: rgb(0.47, 0.47, 0.47),
  });

  let current = x;
  columns.slice(0, -1).forEach((columnWidth) => {
    current += columnWidth;
    page.drawLine({
      start: { x: current, y: top },
      end: { x: current, y: top - height },
      thickness: 1,
      color: rgb(0.47, 0.47, 0.47),
    });
  });
}

async function loadAssets() {
  if (!assetsPromise) {
    assetsPromise = Promise.all([
      fetchBinary(logoUrl),
      fetchBinary(footerUrl),
      fetchBinary(fontUrl),
    ]).then(([logo, footer, font]) => ({ logo, footer, font }));
  }

  return assetsPromise;
}

async function fetchBinary(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load asset: ${url}`);
  }

  return new Uint8Array(await response.arrayBuffer());
}

function formatMoney(value: number) {
  return euro.format(value);
}

function formatDate(value: string) {
  return dutchDate.format(new Date(value));
}

function addDays(value: string, days: number) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatHours(value: number) {
  const totalMinutes = Math.round(value * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function toArrayBuffer(bytes: Uint8Array) {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}
