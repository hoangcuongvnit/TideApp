using Account.Application.Interfaces;
using Account.Domain.IRepositories;
using Account.Domain.Models;

namespace Account.Application.Services
{
    public class RoleClaimService : IRoleClaimService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RoleClaimService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<IEnumerable<RoleClaim>> GetRoleClaimsByRoleIdAsync(Guid roleId)
            => Task.FromResult<IEnumerable<RoleClaim>>(_unitOfWork.RoleClaim
                .GetByConditionWithOutTracking(x => x.RoleId == roleId));

        public Task<IEnumerable<RoleClaim>> GetRoleClaimsByRoleIdsAsync(List<Guid> roleIds)
            => Task.FromResult<IEnumerable<RoleClaim>>(_unitOfWork.RoleClaim
                .GetByConditionWithOutTracking(x => roleIds.Contains(x.RoleId)));

        public async Task AddRoleClaimsAsync(List<RoleClaim> roleClaims, bool isSave = false)
        {
            _unitOfWork.RoleClaim.InsertRange(roleClaims);
            if (isSave) await _unitOfWork.SaveChangesAsync();
        }
    }
}
