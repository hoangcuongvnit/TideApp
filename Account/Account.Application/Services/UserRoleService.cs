using Account.Application.Interfaces;
using Account.Domain.IRepositories;
using Account.Domain.Models;
using Core.Account.Models;
using Microsoft.EntityFrameworkCore;

namespace Account.Application.Services
{
    public class UserRoleService : IUserRoleService
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserRoleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<int> CreateRangeAsync(Guid userId, List<Guid> roleIds, bool isSave = false)
        {
            var userRoles = new List<UserRole>();
            foreach (var roleId in roleIds)
            {
                userRoles.Add(new UserRole(userId, roleId));
            }
            _unitOfWork.UserRole.InsertRange(userRoles);

            return isSave ? await _unitOfWork.SaveChangesAsync() : 1;
        }

        public async Task<List<Role>?> GetRolesByUserIdAsync(Guid userId)
        {
            return await _unitOfWork.UserRole
                .GetByConditionWithOutTracking(x => x.UserId == userId)
                .Include(x => x.Role)
                    .ThenInclude(x => x.RoleClaims)
                    .Select(x => x.Role)
                        .ToListAsync();
        }

        public void Delete(User user, Role role)
        {
            var userRole = _unitOfWork.UserRole.FindByCondition(x => x.RoleId == role.Id && x.UserId == user.Id).FirstOrDefault();
            if (userRole != null)
            {
                _unitOfWork.UserRole.Delete(userRole);
            }
        }

        public void Delete(Guid userId, Guid roleId)
        {
            var userRole = _unitOfWork.UserRole.FindByCondition(x => x.RoleId == roleId && x.UserId == userId).FirstOrDefault();
            if (userRole != null)
            {
                _unitOfWork.UserRole.Delete(userRole);
            }
        }

        public void DeleteRange(Guid userId, List<Guid> roleIds)
        {
            var userRoles = _unitOfWork.UserRole.FindByCondition(x => x.UserId == userId && roleIds.Contains(x.RoleId)).ToList();
            if (userRoles != null && userRoles.Count > 0)
            {
                _unitOfWork.UserRole.DeleteRange(userRoles);
            }
        }

        public async Task<int> SaveAsync()
        {
            return await _unitOfWork.SaveChangesAsync();
        }

        /// <summary>
        /// Update user roles
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="roleIds"></param>
        /// <param name="currentUserRoles"></param>
        /// <param name="isSave"></param>
        /// <returns></returns>
        public async Task<int> UpdateRangeAsync(Guid userId, List<Guid> roleIds, bool isSave = false)
        {
            var currentUserRoles = await _unitOfWork.UserRole.FindByCondition(x => x.UserId == userId).ToListAsync();
            var userRoles = new List<UserRole>();
            foreach (var roleId in roleIds)
            {
                if (currentUserRoles.Any(x => x.RoleId == roleId))
                {
                    continue;
                }
                userRoles.Add(new UserRole(userId, roleId));
            }
            _unitOfWork.UserRole.InsertRange(userRoles);

            var deleteUserRole = currentUserRoles?.Where(x => !roleIds.Contains(x.RoleId)).ToList();
            if (deleteUserRole != null && deleteUserRole.Count > 0)
            {
                _unitOfWork.UserRole.DeleteRange(deleteUserRole);
            }

            return isSave ? await _unitOfWork.SaveChangesAsync() : 1;
        }
    }
}
