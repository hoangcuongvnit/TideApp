using Account.API.Dtos;
using Account.API.Extensions;
using Account.Application.Interfaces;
using Account.Domain.Models;
using Core.Account.Models;
using Library.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Account.Domain.Constants.DataDefault;

namespace Account.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserServices _userServices;
        private readonly IRoleService _roleService;
        private readonly IUserRoleService _userRoleService;
        private readonly IUserTokenService _userTokenService;
        private readonly IUserClaimService _userClaimService;
        private readonly IRoleClaimService _roleClaimService;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _configuration;
        private readonly ILogger _logger;
        public AuthController(
            IUserServices userServices,
            IRoleService roleService,
            IUserRoleService userRoleService,
            IUserTokenService userTokenService,
            IUserClaimService userClaimService,
            IRoleClaimService roleClaimService,
            IEmailSender emailSender,
            IConfiguration configuration,
            ILogger<AuthController> logger)
        {
            _userServices = userServices;
            _roleService = roleService;
            _userRoleService = userRoleService;
            _userTokenService = userTokenService;
            _userClaimService = userClaimService;
            _roleClaimService = roleClaimService;
            _emailSender = emailSender;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IResult> Login(SignInDto model)
        {
            var user = await _userServices.GetUserByEmailAsync(model.Email);
            var badRequestObject = new BadRequestObject();

            if (user == null)
            {
                badRequestObject.Add(nameof(AC_SignIn_Invalid), AC_SignIn_Invalid);
            }
            else if (user.Status == UserStatus.AwaitingVerification)
            {
                badRequestObject.Add(nameof(AC_SignIn_AwaitingVerification), AC_SignIn_AwaitingVerification);
            }
            else if (user.Status == UserStatus.PendingApproval)
            {
                badRequestObject.Add(nameof(AC_SignIn_PendingApproval), AC_SignIn_PendingApproval);
            }
            else if (user.Status != UserStatus.Active)
            {
                badRequestObject.Add(nameof(AC_SignIn_NotReady), AC_SignIn_NotReady);
            }
            else
            {
                var isValidPassword = user.VerifyPassword(model.Password);
                if (!isValidPassword)
                {
                    badRequestObject.Add(nameof(AC_SignIn_Invalid), AC_SignIn_Invalid);
                }
            }

            if (badRequestObject.Errors.Any())
            {
                return Results.BadRequest(badRequestObject);
            }

            var roles = await _userRoleService.GetRolesByUserIdAsync(user.Id);
            var roleClaims = new List<RoleClaim>();
            if (roles.Count > 0)
            {
                roleClaims = (await _roleClaimService.GetRoleClaimsByRoleIdsAsync(roles.Where(x => x != null).Select(x => x.Id).ToList())).ToList();
            }

            var userClaims = (await _userClaimService.GetUserClaimsByUserIdAsync(user.Id)).ToList();

            var token = _userTokenService.GenerateSignInToken(user,
                roles.Select(x => x?.Name ?? string.Empty).ToList(),
                roleClaims, userClaims);

            return Results.Ok(
                new ApiResults<SignInResultDto>()
                {
                    Results = new SignInResultDto()
                    {
                        Token = token,
                        Avatar = user?.Avatar ?? string.Empty
                    }
                });
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IResult> Register(SignUpDto model)
        {
            var badRequestObject = new BadRequestObject();

            var isExisting = await _userServices.ValidateEmailIsExisting(model.Email);
            if (isExisting)
            {
                badRequestObject.Add(nameof(model.Email), nameof(AC_Email_Exist), AC_Email_Exist);
                return Results.BadRequest(badRequestObject);
            }

            //Get Default Editor Role
            var role = await _roleService.GetRoleByNameAsync(RoleDefault.Customer);

            //Create User
            var birthDate = model.BirthDate == null ? (DateTime?)null : DateTime.SpecifyKind(model.BirthDate.Value, DateTimeKind.Utc);
            var user = new User(model.Email, model.PhoneNumber, model.DisplayName, null, null, null, null, model.Address, birthDate);
            user.SetPasswordHash(model.Password);

            if (role != null && role.Id != Guid.Empty)
            {
                user.UserRoles = new List<UserRole>()
                {
                    new UserRole(user.Id, role.Id)
                };
            }
            var rowCount = await _userServices.CreateUserAsync(user, true);

            string token = string.Empty;
            if (rowCount > 0)
            {
                //Generate Email confirm token
                token = _userTokenService.GenerateEmailConfirmationTokenAsync(user);
            }

            if (!string.IsNullOrEmpty(token))
            {
                /*Send Email confirm callback code*/
                string callbackUrl = _configuration.GetSection("ApiFrontEnd").Value + $"/verify-email?id={user.Id.ToString()}&token={token}";
                if (callbackUrl != null)
                {
                    _emailSender.SendEmailConfirmationAsync(model.Email, callbackUrl);
                }
            }
            else
            {
                badRequestObject.Add(nameof(AC_SignUp_Error), AC_SignUp_Error);
                return Results.BadRequest(badRequestObject);
            }

            return Results.Created(nameof(Register),
                new ApiResults<string>()
                {
                    Results = token,
                    Messages = new ApiResultMessage(nameof(AC_SignUp_Success), AC_SignUp_Success)
                });
        }

        [HttpGet]
        [Route("confirm-email/{id}")]
        [AllowAnonymous]
        public async Task<IResult> ConfirmEmail([FromRoute] Guid id, string code)
        {
            var badRequestObject = new BadRequestObject();
            if (id == Guid.Empty || string.IsNullOrWhiteSpace(code))
            {
                badRequestObject.Add(nameof(AC_Verification_Error), AC_Verification_Error);
                return Results.BadRequest(badRequestObject);
            }

            var user = await _userServices.FindUserAsync(id);

            if (user == null)
            {
                badRequestObject.Add(nameof(AC_Account_NotExist), AC_Account_NotExist);
            }
            else if (user.EmailConfirmed)
            {
                badRequestObject.Add(nameof(AC_Account_Ready), AC_Account_Ready);
            }
            else
            {
                var userToken = new UserToken()
                {
                    LoginProvider = Providers.Local,
                    Name = TokenNames.VerifyEmail,
                    UserId = id,
                    Value = code
                };
                var isValid = await _userTokenService.ValidateConfirmationTokenAsync(userToken);
                if (!isValid)
                {
                    badRequestObject.Add(nameof(AC_Verification_Invalid), AC_Verification_Invalid);
                }
            }

            if (badRequestObject.Errors.Any())
            {
                return Results.BadRequest(badRequestObject);
            }

            _userTokenService.DeleteUserTokenByUser(id);

            if (user != null)
            {
                user.EmailConfirmed = true;
                user.Status = UserStatus.Active;
                await _userServices.UpdateUser(user, true);
            }

            return Results.Created(nameof(Register),
                new ApiResults<bool>()
                {
                    Results = true,
                    Messages = new ApiResultMessage(nameof(AC_Verification_Success), AC_Verification_Success)
                });
        }

        [HttpPost]
        [Route("reset-password/{id}")]
        [AllowAnonymous]
        public async Task<IResult> ResetPassword([FromRoute] Guid id, ResetPasswordDto resetPassword)
        {
            var badRequestObject = new BadRequestObject();
            var user = await _userServices.FindUserAsync(id);

            if (user == null)
            {
                badRequestObject.Add(nameof(AC_Account_NotExist), AC_Account_NotExist);
            }
            else if (user.Status != UserStatus.Active)
            {
                badRequestObject.Add(nameof(AC_SignIn_NotReady), AC_SignIn_NotReady);
            }
            else
            {
                var isValid = _userTokenService.ValidateResetPasswordTokenAsync(user.SecurityStamp, user.Email, resetPassword.Token);
                if (!isValid)
                {
                    badRequestObject.Add(nameof(AC_InvalidAuthentication), AC_InvalidAuthentication);
                }
            }

            if (badRequestObject.Errors.Any())
            {
                return Results.BadRequest(badRequestObject);
            }

            if (user != null)
            {
                user.SetPasswordHash(resetPassword.Password);
                await _userServices.UpdateUser(user, true);
            }

            return Results.Ok(
                new ApiResults<bool>()
                {
                    Results = true,
                    Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
                });
        }

        [HttpPost]
        [Route("forgot-password")]
        [AllowAnonymous]
        public async Task<IResult> ForgotPassword(ForgotPasswordDto model)
        {
            var badRequestObject = new BadRequestObject();
            var user = await _userServices.GetUserByEmailAsync(model.Email);
            if (user == null)
            {
                badRequestObject.Add(nameof(model.Email), nameof(AC_Account_NotExist), AC_Account_NotExist);
                return Results.BadRequest(badRequestObject);
            }
            if (user.Status != UserStatus.Active)
            {
                badRequestObject.Add(nameof(AC_SignIn_NotReady), AC_SignIn_NotReady);
                return Results.BadRequest(badRequestObject);
            }

            var token = _userTokenService.GenerateSecurityVerifyToken(user);

            /*Send Email confirm callback code*/
            string callbackUrl = _configuration.GetSection("ApiFrontEnd").Value + $"/reset-password?token={token}";
            if (callbackUrl != null)
            {
                _emailSender.SendEmailConfirmationAsync(model.Email, callbackUrl, "Reset your password");
            }

            return Results.Ok(
                new ApiResults<bool>()
                {
                    Results = true,
                    Messages = new ApiResultMessage(nameof(AC_ForgotPassword_Success), AC_ForgotPassword_Success)
                });
        }

        [HttpPost]
        [Route("logout")]
        public IResult Logout()
        {
            var data = new ApiResults<bool> { Results = true };
            return Results.Ok(data);
        }
    }
}
