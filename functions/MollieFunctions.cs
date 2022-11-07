using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Mollie.Api.Client;
using Mollie.Api.Client.Abstract;
using Mollie.Api.Models.Payment.Request;
using System.Text.Json;
using System.Threading.Tasks;
using Xania.Functions.Helpers;

namespace Xania.Functions
{
    public static class MollieFunctions
    {
        public static IPaymentClient CreatePaymentClient(ExecutionContext context)
        {
            var configuration = FunctionAppConfiguration.Get(context);
            return new PaymentClient(configuration["Mollie:ApiKey"]);
        }

        [FunctionName("list-payments")]
        public static async Task<IActionResult> ListPayments(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "mollie/payments")] HttpRequest req,
            ExecutionContext context)
        {
            var paymentClient = CreatePaymentClient(context);

            var result = await paymentClient.GetPaymentListAsync();
            return new OkObjectResult(result.Items);
        }

        [FunctionName("create-payments")]
        public static async Task<IActionResult> CreatePayments(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "mollie/payments")] HttpRequest req,
            ExecutionContext context,
            ILogger log)
        {
            var paymentClient = CreatePaymentClient(context);

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            };

            // string requestBody = await new StreamReader(req.Body).ReadToEndAsync();

            // var request = System.Text.Json.JsonSerializer.Deserialize<PaymentRequest>(requestBody, options);
            var request = req.FromBody<PaymentRequest>();
            var result = await paymentClient.CreatePaymentAsync(request);
            return new OkObjectResult(result);
        }
    }
}
