using Blog.Domain.Models;
using Library.Infrastructure.Interfaces;

namespace Blog.Domain.IRepositories
{
    public interface IPostRepository : IRepository<Post>
    {
        Task<Post?> GetByIdAsync(Guid id);
    }
}
