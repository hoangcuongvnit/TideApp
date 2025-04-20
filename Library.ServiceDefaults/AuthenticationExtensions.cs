using Library.Domain;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Library.ServiceDefaults;

public static class AuthenticationExtensions
{
    public static IServiceCollection AddDefaultAuthentication(this IHostApplicationBuilder builder)
    {
        var services = builder.Services;
        var configuration = builder.Configuration;

        var configurationTokens = configuration.GetSection("Tokens");
        builder.Services.Configure<TokenConfiguration>(configurationTokens);

        var tokens = configurationTokens.Get<TokenConfiguration>();
        var key = Encoding.UTF8.GetBytes(tokens?.Secret ?? string.Empty);
        builder.Services.AddAuthentication(x =>
        {
            x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(x =>
        {
            x.RequireHttpsMetadata = false;
            x.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = tokens?.Issuer ?? string.Empty,
                ValidateAudience = true,
                ValidAudience = tokens?.Audience ?? string.Empty,
            };
        });

        services.AddAuthorization();

        return services;
    }
}
