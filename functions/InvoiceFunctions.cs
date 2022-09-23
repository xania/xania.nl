using AzureFunctions.Extensions.Swashbuckle.Attribute;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using System.Threading.Tasks;
using Xania.Functions.Helpers;
using Xania.Functions.Invoices;
using static iText.Svg.SvgConstants;

namespace Xania.Functions
{
    public static class InvoiceFunctions
    {
        [FunctionName("invoice")]
        [ProducesResponseType(typeof(byte[]), 200)]
        [Produces("application/octet-stream")]
        public static async Task<IActionResult> CreateInvoice(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "invoice")][RequestBodyType(typeof(Invoice), "Invoice")] HttpRequest req)
        {
            
            var invoice = await req.FromBody<Invoice>();

            var generateFunc = InvoiceReport.Generate(invoice);
            req.HttpContext.Response.ContentType = "application/octet-stream";
            return new FuncActionResult(generateFunc, $"Fact {invoice.Number} Xania.pdf");
        }
    }
}
