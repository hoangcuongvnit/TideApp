using Account.Domain.IRepositories;
using Account.Domain.Models;
using Library.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Account.Infrastructure.Repositories
{
    public class RoleRepository : Repository<Role>, IRoleRepository
    {
        public RoleRepository(AccountDatabaseContext repositoryContext)
            : base(repositoryContext)
        {
        }

        public async Task<Role?> GetRoleByNameNoTrackingAsync(string name)
        {
            return await FindByCondition(role => role.Name.ToLower() == name.ToLower())
                .AsNoTracking()
                .Include(x => x.RoleClaims)
                .FirstOrDefaultAsync();
        }
    }
}
