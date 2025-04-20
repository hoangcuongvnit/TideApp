using Account.Domain.IRepositories;
using Account.Domain.Models;
using Library.Infrastructure;

namespace Account.Infrastructure.Repositories
{
    public class UserLoginRepository : Repository<UserLogin>, IUserLoginRepository
    {
        public UserLoginRepository(AccountDatabaseContext repositoryContext)
            : base(repositoryContext)
        {
        }
    }
}
