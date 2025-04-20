using Library.Claim;
using Library.Domain;
using Library.ServiceDefaults;
using Microsoft.AspNetCore.Authorization;

namespace Blog.API.Extensions
{
    public static class AuthorizationExtensions
    {
        public static void AddAuthorizationPolicy(this IServiceCollection services)
        {
            var claims = BlogClaims.Claims().ToList();

            services.AddAuthorization(options =>
            {
                foreach (var claim in claims)
                {
                    options.AddPolicy(claim,
                        policy => policy.Requirements.Add(new PermissionRequirement(claim)));
                }
            });

            services.AddSingleton<IAuthorizationHandler, PermissionRequirementHandler>();
        }
    }
}
