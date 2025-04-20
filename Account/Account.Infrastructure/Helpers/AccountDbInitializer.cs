using Account.Domain.Models;
using Core.Account.Models;
using Library.Claim;
using Library.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Data;
using System.Diagnostics;
using static Account.Domain.Constants.DataDefault;

namespace Account.Infrastructure.Helpers
{
    internal class AccountDbInitializer(IServiceProvider serviceProvider, ILogger<AccountDbInitializer> logger)
        : BackgroundService
    {
        public const string ActivitySourceName = "Migrations";

        private readonly ActivitySource _activitySource = new(ActivitySourceName);

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            using var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AccountDatabaseContext>();
            var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
            var emailAdministrators = configuration[$"Demo:Email"] ?? string.Empty;
            var passwordAdministrators = configuration[$"Demo:Password"] ?? string.Empty;

            if (!await dbContext.Users.AnyAsync(cancellationToken))
            {
                await InitializeDatabaseAsync(dbContext, cancellationToken, emailAdministrators, passwordAdministrators);
            }
        }

        private async Task InitializeDatabaseAsync(AccountDatabaseContext dbContext, CancellationToken cancellationToken, string email, string password)
        {
            using var activity = _activitySource.StartActivity("Initializing catalog database", ActivityKind.Client);

            var sw = Stopwatch.StartNew();

            var strategy = dbContext.Database.CreateExecutionStrategy();

            try
            {
                await strategy.ExecuteAsync(async (token) => { await dbContext.Database.MigrateAsync(token); }, cancellationToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while migrating the database");
            }

            await SeedAsync(dbContext, cancellationToken, email, password);

            logger.LogInformation("Database initialization completed after {ElapsedMilliseconds}ms", sw.ElapsedMilliseconds);
        }

        private async Task SeedAsync(AccountDatabaseContext dbContext, CancellationToken cancellationToken, string email, string password)
        {
            logger.LogInformation("Seeding database");
            static List<Role> GetPreconfiguredRoles()
            {
                return [
                    new Role(RoleDefault.Administrator, $"Role_{RoleDefault.Administrator.ToLower()}", 0),
                    new Role(RoleDefault.Owner, $"Role_{RoleDefault.Owner.ToLower()}", 1),
                    new Role(RoleDefault.Author, $"Role_{RoleDefault.Author.ToLower()}", 2),
                    new Role(RoleDefault.Customer, $"Role_{RoleDefault.Customer.ToLower()}", 3),
                    new Role(RoleDefault.Guest, $"Role_{RoleDefault.Guest.ToLower()}", 3)
                ];
            }

            static User GetPreconfiguredUsers(string email)
            {
                return new User(email);
            }

            var claims = UserClaims.Claims().ToList();
            claims.AddRange(BlogClaims.Claims());
            claims.AddRange(WebApplicationClaims.Claims());

            if (!dbContext.Roles.Any())
            {
                var roles = GetPreconfiguredRoles();
                await dbContext.Roles.AddRangeAsync(roles, cancellationToken);

                logger.LogInformation("Seeding {RoleCount} Roles", roles.Count);

                // Seed RoleClaims for Administrator
                var roleAdministrator = roles.FirstOrDefault(x => x.Name == RoleDefault.Administrator);
                if (roleAdministrator != null && !dbContext.RoleClaims.Any())
                {
                    var roleClaims = claims.Select(claim => new RoleClaim(roleAdministrator.Id, AppClaimType.Permissions, claim)).ToList();
                    await dbContext.RoleClaims.AddRangeAsync(roleClaims, cancellationToken);
                }

                // Seed RoleClaims for Owner
                var roleOwner = roles.FirstOrDefault(x => x.Name == RoleDefault.Owner);
                if (roleOwner != null && !dbContext.RoleClaims.Any())
                {
                    var roleClaims = claims.Where(x => !x.Contains("Root")).Select(claim => new RoleClaim(roleOwner.Id, AppClaimType.Permissions, claim)).ToList();
                    await dbContext.RoleClaims.AddRangeAsync(roleClaims, cancellationToken);
                }

                // Seed RoleClaims for Author
                var rolePublisher = roles.FirstOrDefault(x => x.Name == RoleDefault.Author);
                if (rolePublisher != null && !dbContext.RoleClaims.Any())
                {
                    claims = BlogClaims.Claims().ToList();

                    var roleClaims = claims.Where(x => !x.Contains("Root")).Select(claim => new RoleClaim(rolePublisher.Id, AppClaimType.Permissions, claim)).ToList();
                    await dbContext.RoleClaims.AddRangeAsync(roleClaims, cancellationToken);
                }

                await dbContext.SaveChangesAsync(cancellationToken);
            }

            if (!dbContext.Users.Any() && !string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(password))
            {
                var user = GetPreconfiguredUsers(email);
                user.SetPasswordHash(password);
                user.SetStatus(UserStatus.Active);
                await dbContext.Users.AddAsync(user, cancellationToken);

                logger.LogInformation("Seeding user");

                var role = await dbContext.Roles.FirstOrDefaultAsync(x => x.Name == RoleDefault.Administrator);
                if (role != null)
                {
                    await dbContext.UserRoles.AddAsync(new UserRole(user.Id, role.Id), cancellationToken);
                }

                await dbContext.SaveChangesAsync(cancellationToken);
            }
        }
    }

}
