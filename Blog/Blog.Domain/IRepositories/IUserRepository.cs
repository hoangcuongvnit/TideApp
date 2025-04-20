using Blog.Domain.Models;
using Library.Infrastructure.Interfaces;

namespace Blog.Domain.IRepositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByIdAsync(Guid id);
    }
}
