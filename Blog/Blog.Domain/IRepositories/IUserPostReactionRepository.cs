using Blog.Domain.Models;
using Library.Infrastructure.Interfaces;

namespace Blog.Domain.IRepositories
{
    public interface IUserPostReactionRepository : IRepository<UserPostReaction>
    {
        Task<UserPostReaction?> GetByIdAsync(Guid userId, Guid postId, Guid reactionId);
    }
}
