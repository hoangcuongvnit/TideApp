using Account.Domain.IRepositories;
using Account.Domain.Models;
using Library.Infrastructure;

namespace Account.Infrastructure.Repositories
{
    public class WebApplicationRepository : Repository<WebApplication>, IWebApplicationRepository
    {
        public WebApplicationRepository(AccountDatabaseContext repositoryContext)
            : base(repositoryContext)
        { }
    }
}
