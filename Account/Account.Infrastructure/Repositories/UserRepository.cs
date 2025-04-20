using Account.Domain.Dtos;
using Account.Domain.IRepositories;
using Core.Account.Models;
using Library.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Account.Infrastructure.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(AccountDatabaseContext repositoryContext)
            : base(repositoryContext)
        {
        }

        public IQueryable<User> FindPagination(PaginationDto paginationData, UserFilterDto? userFilterData)
        {
            var skip = (paginationData.Page - 1) * paginationData.Size;
            var userQuery = FindByParameter(userFilterData);
            var orderByProperty = typeof(User).GetProperty(paginationData.SortBy);

            if (orderByProperty == null)
            {
                return userQuery.OrderBy(x => x.CreatedAt)
                    .Skip(skip).Take(paginationData.Size);
            }

            userQuery = paginationData.IsDescending
                    ? userQuery.OrderByDescending(x => orderByProperty.GetValue(x, null))
                    : userQuery.OrderBy(x => orderByProperty.GetValue(x, null));

            return userQuery.Skip(skip).Take(paginationData.Size);
        }

        public IQueryable<User> FindByParameter(UserFilterDto? filterData)
        {
            var userQuery = DatabaseContext.Set<User>().AsNoTracking();
            if (filterData == null)
            {
                return userQuery;
            }

            if (filterData.RoleId != null && filterData.RoleId != Guid.Empty)
            {
                userQuery = userQuery.Where(x => x.UserRoles != null &&
                    x.UserRoles.Any(x => x.RoleId == filterData.RoleId));
            }
            if (!string.IsNullOrWhiteSpace(filterData.Name))
            {
                userQuery = userQuery.Where(x => x.DisplayName != null && x.DisplayName.Contains(filterData.Name));
            }
            if (!string.IsNullOrWhiteSpace(filterData.Email))
            {
                userQuery = userQuery.Where(x => x.Email != null && x.Email.Contains(filterData.Email));
            }
            if (filterData.Status != null)
            {
                userQuery = userQuery.Where(x => x.Status == filterData.Status);
            }
            if (!string.IsNullOrWhiteSpace(filterData.PhoneNumber))
            {
                userQuery = userQuery.Where(x => x.PhoneNumber != null && x.PhoneNumber.Contains(filterData.PhoneNumber));
            }
            if (filterData.AppId != null && filterData.AppId != Guid.Empty)
            {
                userQuery = userQuery.Where(x => x.ApplicationId == filterData.AppId);
            }
            return userQuery;
        }
    }
}
