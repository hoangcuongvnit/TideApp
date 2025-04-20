using Blog.Domain.IRepositories;
using Blog.Domain.Models;
using Library.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Blog.Infrastructure.Repositories
{
    public class CommentRepository : Repository<Comment>, ICommentRepository
    {
        public CommentRepository(BlogDatabaseContext repositoryContext)
            : base(repositoryContext)
        {
        }

        public async Task<Comment?> GetByIdAsync(Guid id)
        {
            return await FindByCondition(c => c.Id == id)
                .Include(c => c.Post)
                .Include(c => c.User)
                .FirstOrDefaultAsync();
        }
    }
}
