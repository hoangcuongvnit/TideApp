using Account.Application.Interfaces;
using Account.Domain.IRepositories;
using Account.Domain.Models;
using Core.Account.Models;
using Library.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static Account.Domain.Constants.DataDefault;

namespace Account.Application.Services
{
    public class UserTokenService : IUserTokenService
    {
        private readonly TokenConfiguration _tokenConfiguration;
        private readonly IUnitOfWork _unitOfWork;

        public UserTokenService(IUnitOfWork unitOfWork, IOptions<TokenConfiguration> tokenConfiguration)
        {
            _unitOfWork = unitOfWork;
            _tokenConfiguration = tokenConfiguration.Value;
        }

        public async Task<bool> ValidateConfirmationTokenAsync(UserToken userToken)
        {
            var token = await _unitOfWork.UserToken.FindByCondition(x =>
                            x.UserId == userToken.UserId
                            && x.LoginProvider == userToken.LoginProvider
                            && x.Name == userToken.Name).Select(x => x.Value).FirstOrDefaultAsync();

            return token == userToken.Value;
        }

        public bool ValidateResetPasswordTokenAsync(string securityStamp, string email, string token)
        {
            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(securityStamp) || string.IsNullOrEmpty(email)) return false;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes($"{securityStamp}{securityStamp}");

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            };

            try
            {
                SecurityToken validatedToken;
                tokenHandler.ValidateToken(token, tokenValidationParameters, out validatedToken);
                return true;
            }
            catch (SecurityTokenException)
            {
                return false;
            }
        }

        public void CreateUserToken(UserToken userToken)
        {
            _unitOfWork.UserToken.Insert(userToken);
        }

        public void DeleteUserTokenByUser(Guid userId)
        {
            var userTokens = _unitOfWork.UserToken.FindByCondition(x => x.UserId == userId).ToList();
            if (userTokens != null && userTokens.Count > 0)
            {
                _unitOfWork.UserToken.DeleteRange(userTokens);
            }
        }

        public string GenerateEmailConfirmationTokenAsync(User user)
        {
            var token = GenerateSecurityToken(user.SecurityStamp, user.Email, user.Id, _tokenConfiguration.Lifetime);

            var userToken = new UserToken()
            {
                LoginProvider = Providers.Local,
                Name = TokenNames.VerifyEmail,
                UserId = user.Id,
                Value = token
            };

            CreateUserToken(userToken);
            _unitOfWork.SaveChangesAsync();

            return token;
        }

        public string GenerateSecurityVerifyToken(User user)
        {
            var token = GenerateSecurityToken(user.SecurityStamp, user.Email, user.Id, _tokenConfiguration.Lifetime);

            var userToken = new UserToken()
            {
                LoginProvider = Providers.Local,
                Name = TokenNames.ForgotPassword,
                UserId = user.Id,
                Value = token
            };
            CreateUserToken(userToken);
            _unitOfWork.SaveChangesAsync();

            return token;
        }

        public string GenerateSignInToken(User user, List<string> roles, List<RoleClaim>? roleClaims, List<UserClaim>? userClaims)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var utcNow = DateTime.UtcNow;
            var key = Encoding.UTF8.GetBytes(_tokenConfiguration.Secret);
            var roleClaimNames = roleClaims?.Where(x => x.ClaimType == AppClaimType.Permissions)
                .Select(x => x.ClaimValue) ?? new List<string>();
            var userClaimNames = userClaims?.Where(x => x.ClaimType == AppClaimType.Permissions)
                .Select(x => x.ClaimValue);
            var claimNames = userClaimNames != null && userClaimNames?.Count() > 0 ?
                roleClaimNames.Concat(userClaimNames ?? Enumerable.Empty<string>()).Distinct().ToList()
                : roleClaimNames.ToList();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(AppClaimType.Id, user.Id.ToString()),
                    new Claim(AppClaimType.WebAppId, user.ApplicationId?.ToString() ?? string.Empty),
                    new Claim(AppClaimType.Email, user.Email),
                    new Claim(AppClaimType.FullName, user.DisplayName ?? string.Empty),
                    new Claim(AppClaimType.Status, user.Status.ToString()),
                    new Claim(AppClaimType.Jti, Guid.NewGuid().ToString()),
                    new Claim(AppClaimType.Iat, utcNow.ToString()),
                    new Claim(AppClaimType.Roles, string.Join(";", roles)),
                    new Claim(AppClaimType.Permissions, string.Join(";", claimNames))
                }),
                Expires = DateTime.UtcNow.AddHours(_tokenConfiguration.Lifetime),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256),
                Issuer = _tokenConfiguration.Issuer,
                Audience = _tokenConfiguration.Audience
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        private static string GenerateSecurityToken(string securityStamp, string email, Guid id, int expireHours = 24)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes($"{securityStamp}{securityStamp}");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(AppClaimType.Id, id.ToString()),
                    new Claim(AppClaimType.Email, email)
                }),
                Expires = DateTime.UtcNow.AddHours(expireHours),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
