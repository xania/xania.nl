using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Xania.Functions.Invoices;
using Xania.Functions.Helpers;
using System;

namespace Xania.Functions
{
    public static class CreateInvoice
    {
        [FunctionName("create-invoice")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "create-invoice")] HttpRequest req,
            ExecutionContext context,
            ILogger log)
        {
            var invoice = await req.FromBody<Invoice>();


            var generateFunc = InvoiceReport.Generate(invoice);
            return new FuncActionResult(generateFunc, $"Fact {invoice.Number} Xania.pdf");

            // return new ObjectResult(invoice);
        }
    }
}
