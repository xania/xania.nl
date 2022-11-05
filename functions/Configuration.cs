using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Configuration;

namespace Xania.Functions
{
  internal class FunctionAppConfiguration
    {
        public static IConfiguration Get(ExecutionContext context)
        {
            return new ConfigurationBuilder()
                .SetBasePath(context.FunctionAppDirectory)
                .AddUserSecrets("a4181f96-78ae-4c4b-bf5a-9fda6606833f")
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();
        }
    }
}
