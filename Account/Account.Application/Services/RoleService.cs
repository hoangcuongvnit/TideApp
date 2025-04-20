using Account.Application.Interfaces;
using Account.Domain.IRepositories;
using Account.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Account.Application.Services
{
    public class RoleService : IRoleService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RoleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Role>> GetRolesAsync()
            => await Task.FromResult<IEnumerable<Role>>(await _unitOfWork.Role.GetWithOutTrackingAll().ToListAsync());

        public async Task<Role?> GetRoleByNameAsync(string roleName)
            => await _unitOfWork.Role.FirstOrDefaultWithOutTrackingAsync(x => x.Name.ToLower() == roleName.ToLower());

        public async Task<Role?> GetRoleByIdAsync(Guid id)
            => await _unitOfWork.Role.FirstOrDefaultWithOutTrackingAsync(x => x.Id == id);

        public async Task<Role?> GetRoleClaimsByNameAsync(string name)
            => await _unitOfWork.Role.GetRoleByNameNoTrackingAsync(name);

        public async Task<List<Role>?> GetRolesByIdAsync(List<Guid> ids)
            => await _unitOfWork.Role.GetByConditionWithOutTracking(x => ids.Contains(x.Id)).ToListAsync();
    }
}
