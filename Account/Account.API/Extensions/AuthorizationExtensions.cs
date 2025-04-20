using Library.Claim;
using Library.ServiceDefaults;
using Microsoft.AspNetCore.Authorization;

namespace Account.API.Extensions
{
    public static class AuthorizationExtensions
    {
        public static void AddAuthorizationPolicy(this IServiceCollection services)
        {
            var claims = UserClaims.Claims().ToList();
            claims.AddRange(BlogClaims.Claims().ToList());
            claims.AddRange(WebApplicationClaims.Claims().ToList());

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
