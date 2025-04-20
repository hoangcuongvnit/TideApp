using Account.Application.Interfaces;
using Account.Domain.IRepositories;
using Account.Domain.Models;

namespace Account.Application.Services
{
    public class UserClaimService : IUserClaimService
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserClaimService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Get user claims by user id without tracking
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public Task<IEnumerable<UserClaim>> GetUserClaimsByUserIdAsync(Guid userId)
            => Task.FromResult<IEnumerable<UserClaim>>(_unitOfWork.UserClaim
                .GetByConditionWithOutTracking(x => x.UserId == userId));
    }
}
