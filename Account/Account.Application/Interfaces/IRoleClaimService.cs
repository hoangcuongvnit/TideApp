using Account.Domain.Models;

namespace Account.Application.Interfaces
{
    public interface IRoleClaimService
    {
        Task<IEnumerable<RoleClaim>> GetRoleClaimsByRoleIdAsync(Guid roleId);
        Task<IEnumerable<RoleClaim>> GetRoleClaimsByRoleIdsAsync(List<Guid> roleIds);

        Task AddRoleClaimsAsync(List<RoleClaim> roleClaims, bool isSave = false);
    }
}
