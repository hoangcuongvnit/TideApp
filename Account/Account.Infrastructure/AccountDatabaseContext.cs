using Account.Domain.Models;
using Account.Infrastructure.Helpers;
using Core.Account.Models;
using Library.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Account.Infrastructure
{
    public class AccountDatabaseContext : DbContext, IDatabaseContext
    {
        public AccountDatabaseContext(DbContextOptions<AccountDatabaseContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<RoleClaim> RoleClaims { get; set; }
        public DbSet<UserClaim> UserClaims { get; set; }
        public DbSet<UserLogin> UserLogins { get; set; }
        public DbSet<UserToken> UserTokens { get; set; }
        public DbSet<WebApplication> WebApplications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            DatabaseHelper.OnModelEntity(modelBuilder);
        }
    }
}