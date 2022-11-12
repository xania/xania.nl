using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Xania.Functions.Helpers;

namespace Xania.Functions.Invoices
{
    public static class InvoiceFunctions
    {
        [OpenApiOperation]
        [OpenApiRequestBody(typeof(Invoice))]
        [OpenApiResponseBody(typeof(byte[]))]
        [FunctionName("invoice")]
        public static object CreateInvoice(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "invoice")] HttpRequest req)
        {
            var invoice = req.FromBody<Invoice>();

            var generateFunc = InvoiceReport.Generate(invoice);
            req.HttpContext.Response.ContentType = "application/octet-stream";
            return new FuncActionResult(generateFunc, $"Fact {invoice.Number} Xania.pdf");
        }
    }
}
