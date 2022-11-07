using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http;
using System.Net.Security;

[assembly: FunctionsStartup(typeof(Xania.Functions.Startup))]

namespace Xania.Functions
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            Configure(builder.Services);
        }

        public static void Configure(IServiceCollection services)
        {
            services.AddHttpClient("ReverseProxy")
                            .ConfigurePrimaryHttpMessageHandler(() =>
                                new HttpClientHandler()
                                {
                                    AllowAutoRedirect = false,
                                    // MaxAutomaticRedirections = 20,
                                    CookieContainer = new System.Net.CookieContainer(),
                                    ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) =>
                                    {
                                        var isDevelopment = false;
#if DEBUG
                                        isDevelopment = true;
#endif
                                        if (isDevelopment) return true;
                                        return sslPolicyErrors == SslPolicyErrors.None;
                                    }
                                }
                            );
        }
    }
}
