using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace Blog.Infrastructure.Helpers
{
    internal class BlogDbInitializer(IServiceProvider serviceProvider, ILogger<BlogDbInitializer> logger)
        : BackgroundService
    {
        public const string ActivitySourceName = "Migrations";

        private readonly ActivitySource _activitySource = new(ActivitySourceName);

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            using var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<BlogDatabaseContext>();
            var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

            if (!await dbContext.Users.AnyAsync(cancellationToken))
            {
                await InitializeDatabaseAsync(dbContext, cancellationToken);
            }
        }

        private async Task InitializeDatabaseAsync(BlogDatabaseContext dbContext, CancellationToken cancellationToken)
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

            await SeedAsync(dbContext, cancellationToken);

            logger.LogInformation("Database initialization completed after {ElapsedMilliseconds}ms", sw.ElapsedMilliseconds);
        }

        private async Task SeedAsync(BlogDatabaseContext dbContext, CancellationToken cancellationToken)
        {
            logger.LogInformation("Seeding database");
        }
    }

}
