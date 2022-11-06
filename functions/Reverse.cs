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
    public class Reverse
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly HashSet<string> _allowedHeaders = new HashSet<string>(StringComparer.InvariantCultureIgnoreCase)
        {
            "Accept",
            "Accept-Encoding",
            "Accept-Language",
            "Authorization",
            "Connection",
            "Content-Type",
            "User-Agent",
            // "Host",
            "Referer",
        };
        private readonly HashSet<string> _excludeHeaders = new HashSet<string>(StringComparer.InvariantCultureIgnoreCase)
        {
            "Host"
        };

        /*
Accept: application/json
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
Authorization: Bearer [Mollie:ApiKey]
Connection: keep-alive
Content-Type: application/json
Host: localhost:9091
Referer: http://localhost:9091/mollie
sec-ch-ua: "Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36
        */

        public Reverse(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [FunctionName("Reverse")]
        public async Task<HttpResponseMessage> Run(
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
