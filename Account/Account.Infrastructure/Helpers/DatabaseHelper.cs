using Account.Domain.Models;
using Core.Account.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Account.Infrastructure.Helpers
{
    public static class DatabaseHelper
    {
        public static void InitializerDatabase(this IServiceCollection services)
        {
            services.AddOpenTelemetry()
                .WithTracing(tracing => tracing.AddSource(AccountDbInitializer.ActivitySourceName));

            services.AddSingleton<AccountDbInitializer>();
            services.AddHostedService(sp => sp.GetRequiredService<AccountDbInitializer>());
            services.AddHealthChecks()
                .AddCheck<AccountDbInitializerHealthCheck>("DbInitializer", null);
        }

        public static void OnModelEntity(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<User>(b =>
            {
                // Each User can have many UserClaims
                b.HasMany(e => e.Claims)
                    .WithOne(e => e.User)
                    .HasForeignKey(uc => uc.UserId)
                    .IsRequired();

                // Each User can have many UserLogins
                b.HasMany(e => e.Logins)
                    .WithOne(e => e.User)
                    .HasForeignKey(ul => ul.UserId)
                    .IsRequired();

                // Each User can have many UserTokens
                b.HasMany(e => e.Tokens)
                    .WithOne(e => e.User)
                    .HasForeignKey(ut => ut.UserId)
                    .IsRequired();

                // Each User can have many entries in the UserRole join table
                b.HasMany(e => e.UserRoles)
                    .WithOne(e => e.User)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();

                b.HasOne(e => e.Application)
                    .WithMany()
                    .HasForeignKey(e => e.ApplicationId);

                b.HasIndex(u => u.Email).IsUnique();

                b.ToTable("Users");
            });

            modelBuilder.Entity<Role>(b =>
            {
                // Each Role can have many entries in the UserRole join table
                b.HasMany(e => e.UserRoles)
                    .WithOne(e => e.Role)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();

                // Each Role can have many associated RoleClaims
                b.HasMany(e => e.RoleClaims)
                    .WithOne(e => e.Role)
                    .HasForeignKey(rc => rc.RoleId)
                    .IsRequired();

                b.ToTable("Roles");
            });

            modelBuilder.Entity<UserClaim>(b =>
            {
                b.ToTable("UserClaims");
            });

            modelBuilder.Entity<UserLogin>(b =>
            {
                b.ToTable("UserLogins");
            });

            modelBuilder.Entity<UserToken>(b =>
            {
                b.ToTable("UserTokens");
            });

            modelBuilder.Entity<RoleClaim>(b =>
            {
                b.ToTable("RoleClaims");
            });

            modelBuilder.Entity<UserRole>(b =>
            {
                b.HasKey(b => new { b.UserId, b.RoleId });

                b.ToTable("UserRoles");
            });

            modelBuilder.Entity<WebApplication>(b =>
            {
                b.ToTable("WebApplication");
            });
        }
    }
}