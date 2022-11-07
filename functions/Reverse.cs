using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Xania.Functions
{
    public class ReverseFunctions
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly HashSet<string> _excludeHeaders = new HashSet<string>(StringComparer.InvariantCultureIgnoreCase)
        {
            "Host"
        };

        public ReverseFunctions(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [FunctionName("Reverse")]
        public async Task<HttpResponseMessage> RunReverse(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = "reverse/{*endpoint}")] HttpRequestMessage original,
            ExecutionContext context,
            string endpoint,
            ILogger log)
        {
            var config = FunctionAppConfiguration.Get(context);

            var backend = new HttpRequestMessage(original.Method, endpoint + original.RequestUri.Query);
            backend.Version = original.Version;

            if (original.Method == HttpMethod.Post)
            {
                // var body = await original.Content.ReadAsStringAsync();
                backend.Content = original.Content;// new StringContent(body, System.Text.Encoding.UTF8, "application/json");
            }

            foreach (var p in original.Options)
                backend.Options.TryAdd(p.Key, p.Value);

            string Substitute(string value)
            {
                foreach (var k in config.AsEnumerable())
                {
                    value = value.Replace("[" + k.Key + "]", k.Value);
                }
                return value;
            }

            foreach (var header in original.Headers)
            {
                if (!_excludeHeaders.Contains(header.Key))
                    backend.Headers.Add(header.Key, header.Value.Select(Substitute));
            }

            var httpClient = _httpClientFactory.CreateClient("ReverseProxy");
            var response = await httpClient.SendAsync(backend);

            return response;
        }
    }
}
