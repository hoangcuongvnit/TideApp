using Account.Domain.Models;

namespace Account.Application.Interfaces
{
    public interface IUserClaimService
    {
        Task<IEnumerable<UserClaim>> GetUserClaimsByUserIdAsync(Guid userId);
    }
}
