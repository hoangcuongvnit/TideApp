using Blog.Domain.Models;
using Library.Infrastructure.Interfaces;

namespace Blog.Domain.IRepositories
{
    public interface ITagRepository : IRepository<Tag>
    {
        Task<Tag?> GetByIdAsync(Guid id);
    }
}
