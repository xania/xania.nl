using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Xania.Functions.Helpers
{
    internal class FuncActionResult : IActionResult
    {
        private Action<Stream> func;

        public FuncActionResult(Action<Stream> func, string fileName)
        {
            this.func = func;
            FileName = fileName;
        }

        public string FileName { get; }

        public async Task ExecuteResultAsync(ActionContext context)
        {
            context.HttpContext.Response.Headers.Add("Content-Disposition", $"attachment; filename=\"{FileName}\"");

            using var memStream = new MemoryStream();
            this.func(memStream);

            await context.HttpContext.Response.Body.WriteAsync(memStream.ToArray()).ConfigureAwait(true);
        }
    }
}
