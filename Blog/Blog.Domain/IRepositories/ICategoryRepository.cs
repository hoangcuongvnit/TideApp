using Blog.Domain.Models;
using Library.Infrastructure.Interfaces;

namespace Blog.Domain.IRepositories
{
    public interface ICategoryRepository : IRepository<Category>
    {
        Task<Category?> GetByIdAsync(Guid id);
    }
}
