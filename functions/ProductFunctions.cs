using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Xania.Functions.Menucards;
using static Xania.Functions.Menucards.Factories;


namespace Xania.Functions
{
    public static class ProductFunctions
    {
        [FunctionName("product")]
        [ProducesResponseType(typeof(MenuCard), 200)]
        public static IActionResult ProductList(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "product")] HttpRequest req,
            ExecutionContext context,
            ILogger log)
        {
            return new ObjectResult(new MenuCard
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
