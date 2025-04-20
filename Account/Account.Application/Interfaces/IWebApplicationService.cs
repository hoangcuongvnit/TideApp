using Account.Domain.Models;

namespace Account.Application.Interfaces
{
    public interface IWebApplicationService
    {
        Task<IEnumerable<WebApplication>> GetAllAsync();
    }
}
