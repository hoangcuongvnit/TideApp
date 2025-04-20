using Account.Application.Interfaces;
using Account.Application.Services;
using Library.Claim;
using Library.Claim.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace Account.Application
{
    public static class DependencyInjectionApplication
    {
        public static void InjectionApplication(this IServiceCollection services)
        {
            //Scoped Services
            services.AddScoped<IUserServices, UserServices>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IUserTokenService, UserTokenService>();
            services.AddScoped<IUserRoleService, UserRoleService>();
            services.AddScoped<IUserClaimService, UserClaimService>();
            services.AddScoped<IRoleClaimService, RoleClaimService>();
            services.AddScoped<IWebApplicationService, WebApplicationService>();
            services.AddScoped<IClaim, UserClaims>();
            services.AddScoped<IClaim, BlogClaims>();
            services.AddScoped<IClaim, WebApplicationClaims>();
        }
    }
}
