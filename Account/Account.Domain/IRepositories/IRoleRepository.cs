using Account.Domain.Models;
using Library.Infrastructure.Interfaces;

namespace Account.Domain.IRepositories
{
    public interface IRoleRepository : IRepository<Role>
    {
        Task<Role?> GetRoleByNameNoTrackingAsync(string name);
    }
}
