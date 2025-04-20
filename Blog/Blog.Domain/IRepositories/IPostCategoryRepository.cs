using Blog.Domain.Models;
using Library.Infrastructure.Interfaces;

namespace Blog.Domain.IRepositories
{
    public interface IPostCategoryRepository : IRepository<PostCategory>
    {
        Task<PostCategory?> GetByIdAsync(Guid categoryId, Guid postId);
    }
}
