using Azure.Core.Serialization;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Xania.Functions.Menucards;

namespace Xania.Functions
{
    public static class CosmosFunctions
    {
        [OpenApiOperation]
        //[OpenApiResponseWithBody(System.Net.HttpStatusCode.OK, "application/json", bodyType: typeof(MenuCard))]
        [OpenApiResponseBody(typeof(MenuCard))]
        [FunctionName("cosmos-query")]
        public static async Task<object> CosmosQuery(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "cosmos/{client}")] HttpRequest req,
            ExecutionContext context,
            string client,
            ILogger log)
        {
            var container = GetContainer(context, client);

            var queryText = await req.ReadAsStringAsync();

            var result = container.GetItemQueryIterator<JsonElement>(queryText);
            while (result.HasMoreResults)
            {
                var response = await result.ReadNextAsync();
                return response.Resource;
            }

            return Enumerable.Empty<JsonElement>();
        }

        private static Container GetContainer(ExecutionContext context, string client)
        {
            var config = FunctionAppConfiguration.Get(context);

            var section = config.GetSection(client);
            var endpoint = section["Cosmos:AccountEndpoint"];
            var key = section["Cosmos:AccountKey"];

            var cosmosClientOptions = new CosmosClientOptions()
            {
                ConnectionMode = ConnectionMode.Gateway,
                Serializer = new CosmosSystemTextJsonSerializer(new()
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                }),
            };

            var cosmosClient = new CosmosClient(endpoint, key, cosmosClientOptions);
            return cosmosClient.GetDatabase(section["Cosmos:Database"]).GetContainer(section["Cosmos:Container"]);
        }
    }

    public sealed class CosmosSystemTextJsonSerializer : CosmosSerializer
    {
        private readonly JsonObjectSerializer _systemTextJsonSerializer;

        public CosmosSystemTextJsonSerializer(JsonSerializerOptions jsonSerializerOptions)
        {
            _systemTextJsonSerializer = new JsonObjectSerializer(jsonSerializerOptions);
        }

        public override T FromStream<T>(Stream stream)
        {
            if (stream.CanSeek && stream.Length == 0)
            {
                return default;
            }

            if (typeof(Stream).IsAssignableFrom(typeof(T)))
            {
                return (T)(object)stream;
            }

            using (stream)
            {
                return (T)_systemTextJsonSerializer.Deserialize(stream, typeof(T), default);
            }
        }

        public override Stream ToStream<T>(T input)
        {
            var streamPayload = new MemoryStream();
            _systemTextJsonSerializer.Serialize(streamPayload, input, typeof(T), default);
            streamPayload.Position = 0;
            return streamPayload;
        }
    }
}
