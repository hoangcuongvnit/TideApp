using Account.Domain.Models;
using Core.Account.Models;

namespace Account.Application.Interfaces
{
    public interface IUserTokenService
    {
        /// <summary>
        /// Validate token
        /// </summary>
        /// <param name="userToken"></param>
        /// <returns></returns>
        Task<bool> ValidateConfirmationTokenAsync(UserToken userToken);

        bool ValidateResetPasswordTokenAsync(string securityStamp, string email, string token);
        void CreateUserToken(UserToken userToken);
        void DeleteUserTokenByUser(Guid userId);

        /// <summary>
        /// GenerateEmailConfirmationTokenAsync
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        string GenerateEmailConfirmationTokenAsync(User user);

        string GenerateSecurityVerifyToken(User user);

        string GenerateSignInToken(User user, List<string> roles, List<RoleClaim>? roleClaims, List<UserClaim>? userClaims);
    }
}
