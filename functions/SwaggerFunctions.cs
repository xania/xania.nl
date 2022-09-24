using AzureFunctions.Extensions.Swashbuckle;
using AzureFunctions.Extensions.Swashbuckle.Attribute;
using AzureFunctions.Extensions.Swashbuckle.Settings;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Threading.Tasks;

[assembly: WebJobsStartup(typeof(Xania.Functions.SwashbuckleStartup))]

namespace Xania.Functions
{
    public static class SwaggerFunctions
    {
        [SwaggerIgnore]
        [FunctionName("Swagger")]
        public static Task<HttpResponseMessage> Swagger(
                [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "swagger/json")] HttpRequestMessage req,
                [SwashBuckleClient] ISwashBuckleClient swasBuckleClient)
        {
            return Task.FromResult(swasBuckleClient.CreateSwaggerJsonDocumentResponse(req));
        }

        [SwaggerIgnore]
        [FunctionName("SwaggerUI")]
        public static Task<HttpResponseMessage> SwaggerUI(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "swagger/ui")] HttpRequestMessage req,
        [SwashBuckleClient] ISwashBuckleClient swasBuckleClient)
        {
            return Task.FromResult(swasBuckleClient.CreateSwaggerUIResponse(req, "swagger/json"));
        }
    }

    public class SwashbuckleStartup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.AddSwashBuckle(Assembly.GetExecutingAssembly(), opts =>
            {
                opts.AddCodeParameter = true;
                opts.Documents = new[] {
                    new SwaggerDocument {
                        Name = "v1",
                        Title = "Swagger document",
                        Description = "Integrate Swagger UI With Azure Functions",
                        Version = "v2"
                    }
                };

                var all = typeof(SwashbuckleStartup).Assembly
                        .GetReferencedAssemblies()
                        .Select(Assembly.Load)
                        .SelectMany(x => x.DefinedTypes)
                        .Concat(typeof(SwashbuckleStartup).Assembly.DefinedTypes)
                        .ToArray()
                        ;

                opts.ConfigureSwaggerGen = x =>
                {
                    x.UseOneOfForPolymorphism();
                    x.SelectSubTypesUsing(infoType =>
                    {
                        if (typeof(IDescriminatedUnion).IsAssignableFrom(infoType))
                        {
                            var subTypes = all.Where(e => infoType.IsAssignableFrom(e) && e.IsClass && !e.IsAbstract).ToArray();
                            return subTypes;
                        }


                        ////if (infoType.IsInterface)
                        ////{
                        ////    return new[] { typeof(ProductOption), typeof(MultiChoiceOption) };
                        ////}
                        return Enumerable.Empty<Type>();
                    });

                    //x.MapType<Menucards.IOption>(() => new Microsoft.OpenApi.Models.OpenApiSchema
                    //{
                    //});
                    //x.CustomOperationIds(apiDesc =>
                    //{
                    //    return apiDesc.TryGetMethodInfo(out MethodInfo mInfo) ? mInfo.Name + "ttt" : default(Guid).ToString();
                    //});
                };
            });
        }
    }

    [AttributeUsage(AttributeTargets.Interface)]
    public class SubTypesAttribute: Attribute
    {
        public Type[] Types { get; }

        public SubTypesAttribute(params Type[] types)
        {
            Types = types;
        }

    }

    public interface IDescriminatedUnion
    {
        string Type { get; }
    }
}
