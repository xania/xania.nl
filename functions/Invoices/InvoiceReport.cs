using iText.IO.Image;
using iText.Kernel.Colors;
using iText.Kernel.Font;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Colorspace;
using iText.Layout;
using iText.Layout.Borders;
using iText.Layout.Element;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;

namespace Xania.Functions.Invoices
{
    public static class InvoiceReport
    {
        static readonly CultureInfo dutch = new CultureInfo("nl-NL");

        public static Action<Stream> Generate(Invoice invoice)
        {
            return output =>
            {
                var writer = new PdfWriter(output);
                var pdf = new PdfDocument(writer);

                var document = new Document(pdf, PageSize.A4, true);

                var robotoFont = PdfFontFactory.CreateFont(GetResource("roboto.regular.ttf").ReadAllBytes(), PdfFontFactory.EmbeddingStrategy.PREFER_EMBEDDED);
                document.SetFont(robotoFont);

                document.Add(GetImage("logo.PNG", 15));
                document.Add(GetIntro(invoice));
                document.Add(new Paragraph(invoice.Description + "\r\n ").SetMarginTop(10).SetMarginBottom(10));

                document.Add(RenderInvoiceItems(invoice).SetMarginTop(10).SetMarginBottom(10));

                var sender = invoice.Sender;
                var invoiceDate = DateTime.Parse(invoice.Date);
                var invoiceExpirationDate = invoiceDate.AddDays(invoice.ExpirationDays);
                document.Add(Format($"U wordt vriendelijk verzocht het bedrag van {invoice.TotalAmountInclTax,2:C} ",
                    $"uiterlijk {invoiceExpirationDate:d} over te maken op {sender.BankAccount} ten name van {sender.Name}").SetFontColor(Gray(50)).SetPadding(10).SetBackgroundColor(new DeviceRgb(0xE0, 0xE0, 0xF0)));


                document.ShowTextAligned(GetFooter(invoice.Sender), 34, 20, iText.Layout.Properties.TextAlignment.LEFT);
                document.Close();
            };
        }

        private static Table RenderInvoiceItems(Invoice invoice)
        {
            var table = new Table(4);
            table.SetWidth(523);

            table.AddCell("Omschrijving".Cell().Padding(4, 10).SetBorder(new SolidBorder(Gray(0x77), 1)));
            table.AddCell("Uren".Cell().Padding(4, 10).SetBorder(new SolidBorder(Gray(0x77), 1)));
            table.AddCell("Bedrag".Cell().Padding(4, 10).SetBorder(new SolidBorder(Gray(0x77), 1)));
            table.AddCell("BTW".Cell().Padding(4, 10).SetBorder(new SolidBorder(Gray(0x77), 1)));
            // table.SetWidths(new int[] { 100, 50, 50, 50 });

            foreach (var lineItem in invoice.Lines)
            {
                var time = TimeSpan.FromHours(lineItem.Hours);
                var hours = (int)time.TotalHours;
                var minutes = time.Minutes;

                table.AddCell(lineItem.Description.Cell().SetBorder(Border.NO_BORDER).Padding(2, 10).PaddingBottom(6));
                table.AddCell($"{hours}h {minutes}m".Cell().SetBorder(Border.NO_BORDER).Padding(2, 10).PaddingBottom(6));
                table.AddCell(Format($"{lineItem.Amount,2:C}").Cell().SetBorder(Border.NO_BORDER).Padding(2, 10).PaddingBottom(6));
                table.AddCell(Format($"{lineItem.Amount * lineItem.Tax,2:C}").Cell().SetBorder(Border.NO_BORDER).Padding(2, 10).PaddingBottom(6));
            }
            return table;
        }

        private static Table GetIntro(Invoice invoice)
        {
            var table = new Table(2);
            table.SetWidth(523);

            table.SetMarginTop(20);

            table.AddCell(Cell().Add(RenderCompanyProperties(invoice)));
            table.AddCell(
                Cell().Add(
                    RenderInvoiceProperties(invoice).SetHorizontalAlignment(iText.Layout.Properties.HorizontalAlignment.RIGHT)
                ));

            return table;
        }

        public static Paragraph Format(params FormattableString[] items)
        {
            var sb = new StringBuilder();
            foreach (var v in items)
            {
                sb.AppendFormat(dutch, v.Format, v.GetArguments());
            }
            return new Paragraph(sb.ToString());
        }

        private static Paragraph RenderCompanyProperties(Invoice invoice)
        {
            var p = new Paragraph();
            p.SetFixedLeading(14f);
            p.Add(new Text("FACTUUR")
                    .SetBold()
                    .SetFontColor(ColorConstants.DARK_GRAY)
                    .SetFontSize(16)
                );

            p.Add(new Text("\r\n\r\n" + invoice.Company.Name + "\r\n" + invoice.Company.AddressLines.Join("\r\n"))
                    .SetFontColor(Gray(0x50))
                );

            return p;
        }

        public static DeviceRgb Gray(int value)
        {
            return new DeviceRgb(value, value, value);
        }

        private static Table RenderInvoiceProperties(Invoice invoice)
        {
            var table = new Table(2);

            static Cell headerCell(string text) => Cell().SetPaddings(0, 6, 0, 0).Add(new Paragraph(text).SetFixedLeading(17f).AlignRight().SetFontColor(Gray(0x50)));
            static Cell valueCell(string text) => Cell().SetPaddings(0, 0, 0, 6).Add(new Paragraph(text).SetFixedLeading(17f));

            table.AddCell(headerCell("Factuur nr"));
            table.AddCell(valueCell(invoice.Number));

            table.AddCell(headerCell("Datum"));
            table.AddCell(valueCell(DateTime.Parse(invoice.Date).ToString("dd MMM yyyy", dutch)));

            table.AddCell(headerCell("Vervaldatum"));
            table.AddCell(valueCell(DateTime.Parse(invoice.Date).AddDays(invoice.ExpirationDays).ToString("dd MMM yyyy", dutch)));

            table.AddCell(headerCell("Excl btw"));
            table.AddCell(valueCell(invoice.TotalAmountExclTax.ToString("C2", dutch)));

            table.AddCell(headerCell("Btw"));
            table.AddCell(valueCell(invoice.TotalTax.ToString("C2", dutch)));

            table.AddCell(headerCell("Totaal").SetBorder(new SolidBorder(Gray(0x77), 1)).SetBorderRight(Border.NO_BORDER).SetPaddings(4, 6, 4, 0));
            table.AddCell(valueCell(invoice.TotalAmountInclTax.ToString("C2", dutch)).SetBorder(new SolidBorder(Gray(0x77), 1)).SetBorderLeft(Border.NO_BORDER).SetPaddings(4, 0, 4, 6));

            return table;
        }

        private static Paragraph GetFooter(Sender sender)
        {
            var table = new Table(2);
            table.SetBorder(iText.Layout.Borders.Border.NO_BORDER);
            table.AddCell(Cell().Add(GetImage("blue.PNG", 10)));

            var textCell = Cell().SetPaddingLeft(10).Add(new Paragraph(
                    $"{sender.Name} | Laan van Kronenburg 14 1183 AS Amstelveen | ibrahim.bensalah@xania.nl \n" +
                    $"IBAN: {sender.BankAccount} | BTW: NL001613046B67 | KvK: 34236468"
                ).SetFontSize(11));

            table.AddCell(textCell);

            var result = new Paragraph();
            result.Add(table);
            return result;
        }

        public static Cell Cell()
        {
            return new Cell().SetBorder(iText.Layout.Borders.Border.NO_BORDER);
        }

        public static Image GetImage(string name, int scalePercentage)
        {
            using var imageStream = GetResource(name);
            var imageData = ImageDataFactory.CreatePng(imageStream.ReadAllBytes());
            float scale = scalePercentage / 100f;
            return new Image(imageData).Scale(scale, scale);
        }

        public static Stream GetResource(string name)
        {
            return typeof(InvoiceReport).Assembly.GetManifestResourceStream(
                GetResourceName(name));
        }

        public static string GetResourceName(string name)
        {
            return typeof(InvoiceReport).Assembly.GetManifestResourceNames()
                .Single(e => e.EndsWith(name, StringComparison.OrdinalIgnoreCase));
        }
    }


    public static class FormattingExtensions
    {
        public static string Join(this IEnumerable<string> arr, string separator)
        {
            return string.Join(separator, arr);
        }

        public static string Join(this IReadOnlyList<string> arr, string separator)
        {
            return string.Join(separator, arr);
        }

        public static Cell Cell(this string text)
        {
            return new Cell().Add(new Paragraph(text));
        }

        public static Cell Cell(this IBlockElement blockElement)
        {
            return new Cell().Add(blockElement);
        }

        public static Cell Padding(this Cell cell, int topBottom, int leftRight)
        {
            if (cell is null)
                throw new ArgumentNullException(nameof(cell));
            return cell.SetPaddings(topBottom, leftRight, topBottom, leftRight);
        }

        public static Cell PaddingBottom(this Cell cell, int size)
        {
            if (cell is null)
                throw new ArgumentNullException(nameof(cell));
            return cell.SetPaddingBottom(size);
        }

        public static T AlignRight<T>(this ElementPropertyContainer<T> container) where T : IPropertyContainer
        {
            if (container is null)
                throw new ArgumentNullException(nameof(container));
            return container.SetTextAlignment(iText.Layout.Properties.TextAlignment.RIGHT);
        }

        public static byte[] ReadAllBytes(this Stream input)
        {
            if (input is null)
                throw new ArgumentNullException(nameof(input));

            var bytes = new byte[input.Length];
            input.Read(bytes);
            return bytes;
        }
    }
}
