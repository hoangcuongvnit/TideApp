using Blog.Domain.IRepositories;
using Blog.Domain.Models;
using Library.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Blog.Infrastructure.Repositories
{
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        public CategoryRepository(BlogDatabaseContext repositoryContext)
            : base(repositoryContext)
        {
        }

        public async Task<Category?> GetByIdAsync(Guid id)
        {
            return await FindByCondition(c => c.Id == id)
                .Include(c => c.Parent)
                .FirstOrDefaultAsync();
        }
    }
}
