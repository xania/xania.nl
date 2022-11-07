using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Mollie.Api.Client;
using Mollie.Api.Client.Abstract;
using Mollie.Api.Models;
using Mollie.Api.Models.Payment.Request;
using System.Text.Json;
using System.Threading.Tasks;
using Xania.Functions.Helpers;

namespace Xania.Functions
{
    public static class MollieFunctions
    {
        private static IConfiguration GetConfiguration(ExecutionContext context, string client)
        {
            var configuration = FunctionAppConfiguration.Get(context);
            return configuration.GetSection(client);
        }

        public static IPaymentClient CreatePaymentClient(ExecutionContext context, string client)
        {
            var config = GetConfiguration(context, client);
            return new PaymentClient(config["Mollie:ApiKey"]);
        }

        public static IPaymentClient CreatePaymentClient(IConfiguration config)
        {
            return new PaymentClient(config["Mollie:ApiKey"]);
        }

        [FunctionName("list-payments")]
        public static async Task<IActionResult> ListPayments(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "mollie/{client}/payments")] HttpRequest req,
            string client,
            ExecutionContext context)
        {
            var paymentClient = CreatePaymentClient(context, client);

            var result = await paymentClient.GetPaymentListAsync();
            return new OkObjectResult(result.Items);
        }

        [FunctionName("create-payments")]
        public static async Task<IActionResult> CreatePayments(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "mollie/{client}/payments")] HttpRequest req,
            string client,
            ExecutionContext context,
            ILogger log)
        {
            var paymentClient = CreatePaymentClient(context, client);

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

        [FunctionName("create-payment")]
        public static async Task<IActionResult> CreatePayment(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "mollie/{client}/create-payment")]
            HttpRequest req,
            string client,
            ExecutionContext context,
            ILogger log)
        {
            var config = GetConfiguration(context, client);
            var paymentClient = CreatePaymentClient(config);

            var request = new PaymentRequest
            {
                Description = req.Form["Description[]"],
                Amount = new Amount
                {
                    Currency = req.Form["Currency"],
                    Value = req.Form["Amount"]
                },
                RedirectUrl = config["Mollie:RedirectUrl"]

            };
            try
            {
                var result = await paymentClient.CreatePaymentAsync(request);
                return new RedirectResult(result.Links.Checkout.Href);
            }
            catch (System.Exception ex)
            {
                throw ex;
            }
        }
    }
}
