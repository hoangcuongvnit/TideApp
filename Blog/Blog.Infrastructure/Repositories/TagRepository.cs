using Blog.Domain.IRepositories;
using Blog.Domain.Models;
using Library.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Blog.Infrastructure.Repositories
{
    public class TagRepository : Repository<Tag>, ITagRepository
    {
        public TagRepository(BlogDatabaseContext repositoryContext)
            : base(repositoryContext)
        {
        }

        public async Task<Tag?> GetByIdAsync(Guid id)
        {
            return await FindByCondition(t => t.Id == id).FirstOrDefaultAsync();
        }
    }
}
