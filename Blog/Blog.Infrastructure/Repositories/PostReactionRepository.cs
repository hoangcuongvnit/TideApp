using Blog.Domain.IRepositories;
using Blog.Domain.Models;
using Library.Infrastructure;

namespace Blog.Infrastructure.Repositories
{
    public class PostReactionRepository : Repository<PostReaction>, IPostReactionRepository
    {
        public PostReactionRepository(BlogDatabaseContext repositoryContext)
            : base(repositoryContext)
        {
        }
    }
}
