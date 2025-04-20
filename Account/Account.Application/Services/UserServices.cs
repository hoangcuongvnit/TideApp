using Account.Application.Interfaces;
using Account.Domain.Dtos;
using Account.Domain.IRepositories;
using Core.Account.Models;
using Library.Domain;
using Microsoft.EntityFrameworkCore;

namespace Account.Application.Services
{
    public class UserServices : IUserServices
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserServices(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<User?> FindUserAsync(Guid userId)
        {
            return await _unitOfWork.User.FindAsync(userId);
        }

        public async Task<User?> GetUserAsync(Guid userId)
        {
            return await _unitOfWork.User.GetByConditionWithOutTracking(x => x.Id == userId)
                    .Include(x => x.Application).FirstOrDefaultAsync();
        }

        public async Task<User?> GetAppUserAsync(Guid userId, Guid appId)
        {
            return await _unitOfWork.User.GetByConditionWithOutTracking(x => x.Id == userId && x.ApplicationId == appId)
                    .Include(x => x.Application).FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _unitOfWork.User.GetByConditionWithOutTracking(x => x.Email == email).FirstOrDefaultAsync();
        }

        public async Task<bool> ValidateEmailIsExisting(string email)
        {
            var user = await GetUserByEmailAsync(email);
            return user != null && user.Id != Guid.Empty;
        }

        public async Task<(List<User>, int total)> GetUsersAsync(SearchUsersDto searchData)
        {
            var users = searchData.Pagination != null ?
                await _unitOfWork.User.FindPagination(searchData.Pagination, searchData.Filter).Include(x => x.UserRoles).Include(x => x.Application).ToListAsync()
                : await _unitOfWork.User.FindByParameter(searchData.Filter).Include(x => x.UserRoles).Include(x => x.Application).ToListAsync();
            var totalRecords = await _unitOfWork.User.FindByParameter(searchData.Filter).CountAsync();

            return (users, totalRecords);
        }

        public async Task<(List<User>, int total)> GetAppUsersAsync(SearchUsersDto searchData, Guid appId)
        {
            var filterData = searchData.Filter;
            filterData?.SetAppId(appId);
            var users = searchData.Pagination != null ?
                await _unitOfWork.User.FindPagination(searchData.Pagination, filterData).Include(x => x.UserRoles).Include(x => x.Application).ToListAsync()
                : await _unitOfWork.User.FindByParameter(filterData).Include(x => x.UserRoles).Include(x => x.Application).ToListAsync();
            var totalRecords = await _unitOfWork.User.FindByParameter(filterData).CountAsync();

            return (users, totalRecords);
        }

        public async Task<int> CreateUserAsync(User user, bool isSave = false)
        {
            _unitOfWork.User.Insert(user);

            if (isSave)
            {
                return await _unitOfWork.SaveChangesAsync();
            }

            return 1;
        }

        public async Task<int> UpdateUser(User user, bool isSave = false)
        {
            _unitOfWork.User.Update(user);

            return isSave ? await _unitOfWork.SaveChangesAsync() : 1;
        }

        public async Task<int> DeleteUser(Guid userId, bool isSave = false)
        {
            var user = await _unitOfWork.User.FindAsync(userId);
            if (user != null)
            {
                user.Status = UserStatus.Deleted;
                _unitOfWork.User.Update(user);

                return isSave ? await _unitOfWork.SaveChangesAsync() : 1;
            }
            return 0;
        }

        public async Task<int> DeleteAppUser(Guid userId, Guid appId, bool isSave = false)
        {
            var user = await _unitOfWork.User.FindAsync(userId);
            if (user != null && user.ApplicationId == appId)
            {
                user.Status = UserStatus.Deleted;
                _unitOfWork.User.Update(user);

                return isSave ? await _unitOfWork.SaveChangesAsync() : 1;
            }
            return 0;
        }

        public async Task<UserStatus?> GetUserStatusById(Guid id)
        {
            return await _unitOfWork.User.GetByConditionWithOutTracking(x => x.Id == id).Select(x => x.Status).FirstOrDefaultAsync();
        }

        public async Task<List<UserStatisticDto>> GetUserStatistic()
        {
            return await _unitOfWork.User.GetWithOutTrackingAll()
                    .Select(x => new UserStatisticDto(x.Id, x.Status, x.ApplicationId)).ToListAsync();
        }
    }
}
