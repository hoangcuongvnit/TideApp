using Blog.Domain.IRepositories;
using Blog.Domain.Models;
using Library.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Blog.Infrastructure.Repositories
{
    public class UserPostReactionRepository : Repository<UserPostReaction>, IUserPostReactionRepository
    {
        public UserPostReactionRepository(BlogDatabaseContext repositoryContext)
            : base(repositoryContext)
        {
        }

        public async Task<UserPostReaction?> GetByIdAsync(Guid userId, Guid postReactionId, Guid reactionId)
        {
            return await FindByCondition(upr => upr.UserId == userId && upr.PostReactionId == postReactionId)
                .FirstOrDefaultAsync();
        }
    }
}
