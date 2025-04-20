using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Library.ServiceDefaults
{
    internal sealed class OpenApiConfigureOptions : IConfigureOptions<SwaggerGenOptions>
    {
        private readonly IConfiguration _configuration;

        public OpenApiConfigureOptions(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void Configure(SwaggerGenOptions options)
        {

        }
    }
}
