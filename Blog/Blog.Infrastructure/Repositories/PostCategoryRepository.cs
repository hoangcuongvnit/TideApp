using Blog.Domain.IRepositories;
using Blog.Domain.Models;
using Library.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Blog.Infrastructure.Repositories
{
    public class PostCategoryRepository : Repository<PostCategory>, IPostCategoryRepository
    {
        public PostCategoryRepository(BlogDatabaseContext repositoryContext)
            : base(repositoryContext)
        {
        }

        public async Task<PostCategory?> GetByIdAsync(Guid categoryId, Guid postId)
        {
            return await FindByCondition(pc => pc.CategoryId == categoryId && pc.PostId == postId)
                .FirstOrDefaultAsync();
        }
    }
}
