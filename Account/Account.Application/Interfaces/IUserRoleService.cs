using Account.Domain.Models;
using Core.Account.Models;

namespace Account.Application.Interfaces
{
    public interface IUserRoleService
    {
        Task<int> CreateRangeAsync(Guid userId, List<Guid> roleIds, bool isSave = false);
        Task<List<Role?>> GetRolesByUserIdAsync(Guid userId);
        void Delete(User user, Role role);
        void Delete(Guid userId, Guid roleId);
        void DeleteRange(Guid userId, List<Guid> roleIds);
        Task<int> SaveAsync();
        Task<int> UpdateRangeAsync(Guid userId, List<Guid> roleIds, bool isSave = false);

    }
}
