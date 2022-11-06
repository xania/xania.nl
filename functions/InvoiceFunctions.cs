using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using System.Threading.Tasks;
using Xania.Functions.Helpers;
using Xania.Functions.Invoices;

namespace Xania.Functions
{
    public static class InvoiceFunctions
    {
        [OpenApiOperation]
        [OpenApiRequestBody(typeof(Invoice))]
        [OpenApiResponseBody(typeof(byte[]))]
        [FunctionName("invoice")]
        public static async Task<IActionResult> CreateInvoice(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "invoice")] HttpRequest req)
        {
            var invoice = req.FromBody<Invoice>();

            var generateFunc = InvoiceReport.Generate(invoice);
            req.HttpContext.Response.ContentType = "application/octet-stream";
            return new FuncActionResult(generateFunc, $"Fact {invoice.Number} Xania.pdf");
        }
    }
}
