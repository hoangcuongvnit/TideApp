using Account.Domain.IRepositories;
using Account.Domain.Models;
using Library.Infrastructure;

namespace Account.Infrastructure.Repositories
{
    public class RoleClaimRepository : Repository<RoleClaim>, IRoleClaimRepository
    {
        public RoleClaimRepository(AccountDatabaseContext repositoryContext)
            : base(repositoryContext)
        {
        }
    }
}
