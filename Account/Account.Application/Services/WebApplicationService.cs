using Account.Application.Interfaces;
using Account.Domain.IRepositories;
using Account.Domain.Models;

namespace Account.Application.Services
{
    public class WebApplicationService : IWebApplicationService
    {
        private readonly IUnitOfWork _unitOfWork;

        public WebApplicationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<IEnumerable<WebApplication>> GetAllAsync()
            => Task.FromResult<IEnumerable<WebApplication>>(_unitOfWork.WebApplication.GetWithOutTrackingAll());
    }
}
