using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Xania.Functions.Menucards;
using static Xania.Functions.Menucards.Factories;
using static Xania.Functions.OpenApiFunctions;

namespace Xania.Functions
{
    public static class ProductFunctions
    {
        [OpenApiOperation]
        //[OpenApiResponseWithBody(System.Net.HttpStatusCode.OK, "application/json", bodyType: typeof(MenuCard))]
        [OpenApiResponseBody(typeof(MenuCard))]
        [FunctionName("product")]
        public static IActionResult ProductList(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "product")] HttpRequest req,
            ExecutionContext context,
            ILogger log)
        {
            return Json(new MenuCard
            {
                Dishes = new[]
                {
                    new Product
                    {
                        Id = 1,
                        Title = "dish 1",
                        Description = "desh description 1",
                        Price = 123,
                        Options =
                        {
                            MultiChoice("Formaat", Option("groot"), Option("midden"), Option("klein") ),
                            MultiChoice("Topping", Option("kaas"), Option("tomaat"), Option("mozzarella") )
                        }
                    },
                    new Product
                    {
                        Id = 2,
                        Title = "dish 2",
                        Description = "desh description 2",
                        Price = 123
                    },
                    new Product
                    {
                        Id = 3,
                        Title = "dish 3",
                        Description = "desh description 3",
                        Price = 123
                    }
                }
            });
        }



    }

}
