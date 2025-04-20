using Account.Domain.IRepositories;
using Account.Infrastructure.Repositories;
using Library.Infrastructure;
using Library.Infrastructure.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace Account.Infrastructure
{
    public static class DependencyInjectionInfrastructure
    {
        public static void InjectionInfrastructure(this IServiceCollection services)
        {
            services.AddScoped<IEmailSender, EmailSender>();

            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<IUserRoleRepository, UserRoleRepository>();
            services.AddScoped<IRoleClaimRepository, RoleClaimRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserClaimRepository, UserClaimRepository>();
            services.AddScoped<IUserTokenRepository, UserTokenRepository>();
            services.AddScoped<IUserLoginRepository, UserLoginRepository>();
            services.AddScoped<IWebApplicationRepository, WebApplicationRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            //Scoped Repository Entity
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

            //Scoped Repository Database Context
            services.AddScoped<IDatabaseContext, AccountDatabaseContext>();
        }
    }
}
