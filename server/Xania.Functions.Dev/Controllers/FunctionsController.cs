using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.WebApiCompatShim;
using Microsoft.Extensions.Primitives;

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

        [HttpGet("mollie/payments")]
        public Task<IActionResult> ListPayments()
        {
            return MollieFunctions.ListPayments(this.Request, _context);
        }

        [HttpGet("product")]
        public IActionResult Product()
        {
            return ProductFunctions.ProductList(this.Request, _context, _logger);
        }


        [HttpPost("invoice")]
        public object Invoice()
        {
            return InvoiceFunctions.CreateInvoice(this.Request);
        }

        [HttpGet("reverse/{*endpoint}")]
        [HttpPost("reverse/{*endpoint}")]
        public async Task<IActionResult> Reverse([FromServices] IHttpClientFactory factory, string endpoint)
        {
            var func = new ReverseFunctions(factory);
            var response = await func.RunReverse(this.HttpContext.GetHttpRequestMessage(), _context, endpoint, _logger);

            return new HttpResponseMessageResult(response);
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