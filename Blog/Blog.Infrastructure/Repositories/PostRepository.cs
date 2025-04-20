using Blog.Domain.IRepositories;
using Blog.Domain.Models;
using Library.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Blog.Infrastructure.Repositories
{
    public class PostRepository : Repository<Post>, IPostRepository
    {
        public PostRepository(BlogDatabaseContext repositoryContext)
            : base(repositoryContext)
        {
        }

        public async Task<Post?> GetByIdAsync(Guid id)
        {
            return await FindByCondition(p => p.Id == id)
                .Include(p => p.Author)
                .FirstOrDefaultAsync();
        }
    }
}
