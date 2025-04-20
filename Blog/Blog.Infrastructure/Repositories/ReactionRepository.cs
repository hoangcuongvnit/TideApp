using Blog.Domain.IRepositories;
using Blog.Domain.Models;
using Library.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Blog.Infrastructure.Repositories
{
    public class ReactionRepository : Repository<Reaction>, IReactionRepository
    {
        public ReactionRepository(BlogDatabaseContext repositoryContext)
            : base(repositoryContext)
        {
        }

        public async Task<Reaction?> GetByIdAsync(Guid id)
        {
            return await FindByCondition(r => r.Id == id).FirstOrDefaultAsync();
        }
    }
}
