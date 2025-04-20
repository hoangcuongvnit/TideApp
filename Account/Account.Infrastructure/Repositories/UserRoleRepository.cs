using Account.Domain.IRepositories;
using Account.Domain.Models;
using Library.Infrastructure;

namespace Account.Infrastructure.Repositories
{
    public class UserRoleRepository : Repository<UserRole>, IUserRoleRepository
    {
        public UserRoleRepository(AccountDatabaseContext repositoryContext)
            : base(repositoryContext)
        {
        }
    }
}
