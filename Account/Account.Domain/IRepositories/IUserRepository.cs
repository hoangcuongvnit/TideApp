using Account.Domain.Dtos;
using Core.Account.Models;
using Library.Infrastructure.Interfaces;

namespace Account.Domain.IRepositories
{
    public interface IUserRepository : IRepository<User>
    {
        IQueryable<User> FindPagination(PaginationDto paginationData, UserFilterDto? userFilterData);
        IQueryable<User> FindByParameter(UserFilterDto? userFilterData);
    }
}
