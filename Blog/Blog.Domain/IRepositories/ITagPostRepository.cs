using Blog.Domain.Models;
using Library.Infrastructure.Interfaces;

namespace Blog.Domain.IRepositories
{
    public interface ITagPostRepository : IRepository<TagPost>
    {
        Task<TagPost?> GetByIdAsync(Guid tagId, Guid postId);
    }
}
