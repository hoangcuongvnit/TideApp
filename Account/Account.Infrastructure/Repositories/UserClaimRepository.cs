using Account.Domain.IRepositories;
using Account.Domain.Models;
using Library.Infrastructure;

namespace Account.Infrastructure.Repositories
{
    public class UserClaimRepository : Repository<UserClaim>, IUserClaimRepository
    {
        public UserClaimRepository(AccountDatabaseContext repositoryContext)
            : base(repositoryContext)
        {
        }
    }
}
