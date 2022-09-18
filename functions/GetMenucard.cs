using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Xania.Functions.Invoices;
using Xania.Functions.Helpers;
using System;
using Xania.Functions.Menucards;

namespace Xania.Functions
{
    public static class GetMenucard
    {
        [FunctionName("get-menucard")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "get-menucard")] HttpRequest req,
            ExecutionContext context,
            ILogger log)
        {
            return new ObjectResult(new MenuCard
            {
                Dishes = new[]
                {
                    new Dish
                    {
                        Title = "dish 1",
                        Description = "desh description 1",
                        Price = 123
                    },
                    new Dish
                    {
                        Title = "dish 2",
                        Description = "desh description 2",
                        Price = 123
                    },
                    new Dish
                    {
                        Title = "dish 3",
                        Description = "desh description 3",
                        Price = 123
                    }
                }
            });
        }
    }

}
