using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Xania.Functions.Invoices;

namespace Xania.Functions.Dev.Controllers
{
    [ApiController]
    public class FunctionsController : ControllerBase
    {
        private readonly ILogger<FunctionsController> _logger;
        private Microsoft.Azure.WebJobs.ExecutionContext _context;

        public FunctionsController(ILogger<FunctionsController> logger, IConfiguration config)
        {
            _logger = logger;
            _context = new Microsoft.Azure.WebJobs.ExecutionContext()
            {
                FunctionAppDirectory = config["FUNCTION_APP_DIRECTORY"]
            };
        }

        [HttpPost("invoice")]
        public object Invoice()
        {
            return InvoiceFunctions.CreateInvoice(this.Request);
        }
    }


    public class HttpResponseMessageResult : IActionResult
    {
        private readonly HttpResponseMessage _responseMessage;

        public HttpResponseMessageResult(HttpResponseMessage responseMessage)
        {
            _responseMessage = responseMessage; // could add throw if null
        }

        public async Task ExecuteResultAsync(ActionContext context)
        {
            context.HttpContext.Response.StatusCode = (int)_responseMessage.StatusCode;

            foreach (var header in _responseMessage.Headers)
            {
                context.HttpContext.Response.Headers.TryAdd(header.Key, new StringValues(header.Value.ToArray()));
            }

            if (_responseMessage.Content != null)
            {
                using (var stream = await _responseMessage.Content.ReadAsStreamAsync())
                {
                    await stream.CopyToAsync(context.HttpContext.Response.Body);
                    await context.HttpContext.Response.Body.FlushAsync();
                }
            }
        }
    }

}