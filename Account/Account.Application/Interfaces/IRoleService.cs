using Account.Domain.Models;

namespace Account.Application.Interfaces
{
    public interface IRoleService
    {
        Task<IEnumerable<Role>> GetRolesAsync();
        Task<Role?> GetRoleByNameAsync(string roleName);
        Task<Role?> GetRoleByIdAsync(Guid id);
        Task<List<Role>?> GetRolesByIdAsync(List<Guid> ids);
        Task<Role?> GetRoleClaimsByNameAsync(string name);
    }
}
