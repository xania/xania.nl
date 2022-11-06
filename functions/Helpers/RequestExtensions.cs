using Microsoft.AspNetCore.Http;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace Xania.Functions.Helpers
{
    public static class RequestExtensions
    {
        public static T FromBody<T>(this HttpRequest req)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            return System.Text.Json.JsonSerializer.Deserialize<T>(req.Body, options);
        }
        public static async Task<T> ToObject<T>(this HttpContent content)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            var stream = await content.ReadAsStreamAsync();
            return System.Text.Json.JsonSerializer.Deserialize<T>(stream, options);
        }
    }
}
