using Account.Domain.Dtos;
using Core.Account.Models;
using Library.Domain;

namespace Account.Application.Interfaces
{
    public interface IUserServices
    {
        Task<User?> FindUserAsync(Guid userId);
        Task<User?> GetUserAsync(Guid userId);
        Task<User?> GetAppUserAsync(Guid userId, Guid appId);
        Task<User?> GetUserByEmailAsync(string email);
        Task<(List<User>, int total)> GetUsersAsync(SearchUsersDto searchData);
        Task<(List<User>, int total)> GetAppUsersAsync(SearchUsersDto searchData, Guid appId);
        Task<bool> ValidateEmailIsExisting(string email);
        Task<int> CreateUserAsync(User user, bool isSave = false);
        Task<int> UpdateUser(User user, bool isSave = false);
        Task<int> DeleteUser(Guid userId, bool isSave = false);
        Task<int> DeleteAppUser(Guid userId, Guid appid, bool isSave = false);
        Task<UserStatus?> GetUserStatusById(Guid id);
        Task<List<UserStatisticDto>> GetUserStatistic();
    }
}
