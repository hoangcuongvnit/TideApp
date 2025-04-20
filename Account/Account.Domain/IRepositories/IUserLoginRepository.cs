using Account.Domain.Models;
using Library.Infrastructure.Interfaces;

namespace Account.Domain.IRepositories
{
    public interface IUserLoginRepository : IRepository<UserLogin>
    {
    }
}
