using Blog.Domain.IRepositories;
using Blog.Domain.Models;
using Library.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Blog.Infrastructure.Repositories
{
    public class TagPostRepository : Repository<TagPost>, ITagPostRepository
    {
        public TagPostRepository(BlogDatabaseContext repositoryContext)
            : base(repositoryContext)
        {
        }

        public async Task<TagPost?> GetByIdAsync(Guid tagId, Guid postId)
        {
            return await FindByCondition(tp => tp.TagId == tagId && tp.PostId == postId)
                .FirstOrDefaultAsync();
        }
    }
}
