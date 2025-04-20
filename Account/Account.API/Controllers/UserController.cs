using Account.API.Dtos;
using Account.API.Extensions;
using Account.Application.Interfaces;
using Account.Domain.Dtos;
using AutoMapper;
using Core.Account.Models;
using Library.Claim;
using Library.Infrastructure.Interfaces;
using Library.ServiceDefaults;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Account.Domain.Constants.DataDefault;

namespace Account.API.Controllers
{
    [Route("api/user")]
    [ApiController]
    [Authorize(Policy = UserClaims.UserManagementView)]
    public class UserController : ControllerBase
    {
        private readonly IUserServices _userServices;
        private readonly IUserRoleService _userRoleService;
        private readonly IRoleService _roleService;
        private readonly IUserClaimService _userClaimService;
        private readonly IUserTokenService _userTokenService;
        private readonly IEmailSender _emailSender;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public UserController(IUserServices userServices,
            IUserRoleService userRoleService,
            IRoleService roleService,
            IUserClaimService userClaimService,
            IUserTokenService userTokenService,
            IEmailSender emailSender,
            IConfiguration configuration,
            IMapper mapper)
        {
            _userServices = userServices;
            _mapper = mapper;
            _userRoleService = userRoleService;
            _userClaimService = userClaimService;
            _userTokenService = userTokenService;
            _emailSender = emailSender;
            _roleService = roleService;
            _configuration = configuration;
        }

        /// <summary>
        /// Get all users with pagination and filter
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("search")]
        [Authorize(Policy = UserClaims.UserManagementView)]
        public async Task<IResult> Search([FromBody] SearchUsersDto model)
        {
            var webAppId = User.GetWebAppId();
            if (model == null || string.IsNullOrWhiteSpace(webAppId))
            {
                var badRequestObject = new BadRequestObject();
                badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
                return Results.BadRequest(badRequestObject);
            }

            var appId = Guid.Parse(webAppId);

            if (model.Filter != null && !string.IsNullOrEmpty(model.Filter.Role))
            {
                var role = await _roleService.GetRoleByNameAsync(model.Filter.Role);
                if (role != null)
                {
                    model.Filter.SetRoleId(role.Id);
                }
            }

            var (users, total) = await _userServices.GetAppUsersAsync(model, appId);
            var listUser = _mapper.Map<List<UserResultDto>>(users);
            foreach (var user in listUser)
            {
                user.RoleIds = users.Where(x => x.Id == user.Id && x.UserRoles != null)?.SelectMany(x => x.UserRoles).Select(x => x.RoleId).ToList() ?? null;
                user.IsEmailVerified = user.Status != UserStatus.AwaitingVerification;
            }

            var roles = await _roleService.GetRolesAsync();
            var listRole = _mapper.Map<List<RoleResultDto>>(roles);
            listRole = listRole.Where(x => x.Name != RoleDefault.Administrator).ToList();

            var data = new UserPaginationResultDto(total, listUser, listRole);

            return Results.Ok(
                new ApiResults<UserPaginationResultDto>()
                {
                    Results = data,
                    Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
                });
        }

        // GET api/<UserController>/5
        [HttpGet]
        [Route("{id}")]
        public async Task<IResult> Get([FromRoute] Guid id)
        {
            var webAppId = User.GetWebAppId();
            var badRequestObject = new BadRequestObject();
            if (string.IsNullOrWhiteSpace(webAppId))
            {
                badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
                return Results.BadRequest(badRequestObject);
            }
            var appId = Guid.Parse(webAppId);

            var user = await _userServices.GetAppUserAsync(id, appId);
            var userRoles = await _userRoleService.GetRolesByUserIdAsync(id);
            var userClaims = await _userClaimService.GetUserClaimsByUserIdAsync(id);

            if (user != null)
            {
                var userResult = _mapper.Map<UserResultDto>(user);
                userResult.IsEmailVerified = userResult.Status != UserStatus.AwaitingVerification;
                if (userRoles != null && userRoles.Count > 0)
                {
                    userResult.RoleIds = userRoles.Select(x => x.Id).ToList();
                    userResult.RoleClaims = userRoles.SelectMany(x => x.RoleClaims).Select(x => x.ClaimValue).ToList();
                }
                if (userClaims != null && userClaims.Count() > 0)
                {
                    userResult.UserClaims = userClaims.Select(x => x.ClaimValue).ToList();
                }

                return Results.Ok(
                    new ApiResults<UserResultDto>()
                    {
                        Results = userResult,
                        Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
                    });
            }

            badRequestObject.Add(nameof(AC_Account_NotExist), AC_Account_NotExist);
            return Results.BadRequest(badRequestObject);
        }

        // POST api/<UserController>
        [HttpPost]
        [Authorize(Policy = UserClaims.UserManagementCreate)]
        public async Task<IResult> Post([FromBody] PostOwnerUserDto model)
        {
            var webAppId = User.GetWebAppId();
            var badRequestObject = new BadRequestObject();
            if (string.IsNullOrWhiteSpace(webAppId))
            {
                badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
                return Results.BadRequest(badRequestObject);
            }
            var appId = Guid.Parse(webAppId);

            var isExisting = await _userServices.ValidateEmailIsExisting(model.Email);
            if (isExisting)
            {
                badRequestObject.Add(nameof(model.Email), nameof(AC_Email_Exist), AC_Email_Exist);
                return Results.BadRequest(badRequestObject);
            }

            //map User
            var user = _mapper.Map<User>(model);
            user.SetStatus(UserStatus.Active);
            user.SetPasswordHash(model.Password);
            user.SetApplication(appId);

            //Check roles
            var roles = model.RoleIds != null && model.RoleIds.Count > 0 ?
                await _roleService.GetRolesByIdAsync(model.RoleIds)
                : null;
            if (roles == null || roles.Count == 0 || roles.Any(x => x.Name == RoleDefault.Administrator))
            {
                badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
                return Results.BadRequest(badRequestObject);
            }

            //Create User
            var rowCount = await _userServices.CreateUserAsync(user, true);

            UserResultDto userResultDT;
            if (rowCount > 0 && model.RoleIds != null && model.RoleIds.Count > 0)
            {
                await _userRoleService.CreateRangeAsync(user.Id, model.RoleIds, true);
                userResultDT = _mapper.Map<UserResultDto>(user);
            }
            else
            {
                badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
                return Results.BadRequest(badRequestObject);
            }

            return Results.Created(nameof(AC_RequestSuccessfully),
                new ApiResults<UserResultDto>()
                {
                    Results = userResultDT,
                    Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
                });
        }

        [HttpPut]
        [Authorize(Policy = UserClaims.UserManagementUpdate)]
        public async Task<IResult> Put([FromBody] PutUserDto model)
        {
            return await UpdateUser(model);
        }

        [HttpPut]
        [Route("password")]
        [Authorize(Policy = UserClaims.UserManagementUpdate)]
        public async Task<IResult> Put([FromBody] PutUserWithPasswordDto model)
        {
            return await UpdateUser(model, model.Password);
        }

        // DELETE api/<UserController>/5
        [HttpDelete]
        [Route("{id}")]
        [Authorize(Policy = UserClaims.UserManagementDelete)]
        public async Task<IResult> Delete(Guid id)
        {
            var webAppId = User.GetWebAppId();
            var badRequestObject = new BadRequestObject();
            if (string.IsNullOrWhiteSpace(webAppId))
            {
                badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
                return Results.BadRequest(badRequestObject);
            }
            var appId = Guid.Parse(webAppId);

            var rowCount = await _userServices.DeleteAppUser(id, appId, true);

            return Results.Accepted(nameof(Delete),
                new ApiResults<bool>()
                {
                    Results = rowCount > 0,
                    Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
                });
        }

        private async Task<IResult> UpdateUser(PutUserDto model, string? password = null)
        {
            var webAppId = User.GetWebAppId();
            var badRequestObject = new BadRequestObject();
            if (string.IsNullOrWhiteSpace(webAppId))
            {
                badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
                return Results.BadRequest(badRequestObject);
            }
            var appId = Guid.Parse(webAppId);

            var oldUser = await _userServices.FindUserAsync(model.Id);
            if (oldUser == null || oldUser.Id == Guid.Empty || string.IsNullOrEmpty(oldUser.Email))
            {
                badRequestObject.Add(nameof(AC_Account_NotExist), AC_Account_NotExist);
                return Results.BadRequest(badRequestObject);
            }

            if (oldUser.Status == UserStatus.Deleted)
            {
                badRequestObject.Add(nameof(AC_Account_Deleted), AC_Account_Deleted);
                return Results.BadRequest(badRequestObject);
            }

            if (oldUser.ApplicationId != appId)
            {
                badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
                return Results.BadRequest(badRequestObject);
            }

            oldUser.PhoneNumber = model.PhoneNumber;
            oldUser.DisplayName = model.DisplayName;
            oldUser.Avatar = model.Avatar;
            oldUser.ProfileUrl = model.ProfileUrl;
            oldUser.Description = model.Description;
            oldUser.Title = model.Title;
            oldUser.Address = model.Address;
            oldUser.BirthDate = model.BirthDate;

            if (!string.IsNullOrWhiteSpace(password))
            {
                oldUser.SetPasswordHash(password);
            }
            var rowCount = await _userServices.UpdateUser(oldUser, true);

            if (model.RoleIds != null && model.RoleIds.Count > 0)
            {
                await _userRoleService.UpdateRangeAsync(model.Id, model.RoleIds, true);
            }

            return Results.Accepted(nameof(PostUserDto),
            new ApiResults<bool>()
            {
                Results = rowCount > 0,
                Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
            });
        }

        [HttpGet]
        [Route("resend/{id}")]
        [Authorize(Policy = UserClaims.UserManagementUpdate)]
        public async Task<IResult> ResendVerifyEmail(Guid id)
        {
            var webAppId = User.GetWebAppId();
            var badRequestObject = new BadRequestObject();
            if (string.IsNullOrWhiteSpace(webAppId))
            {
                badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
                return Results.BadRequest(badRequestObject);
            }
            var appId = Guid.Parse(webAppId);

            var user = await _userServices.FindUserAsync(id);

            if (user == null)
            {
                badRequestObject.Add(nameof(AC_Account_NotExist), AC_Account_NotExist);
                return Results.BadRequest(badRequestObject);
            }

            if (user.Status != UserStatus.AwaitingVerification)
            {
                badRequestObject.Add(nameof(AC_Account_Ready), AC_Account_Ready);
                return Results.BadRequest(badRequestObject);
            }

            if (user.ApplicationId != appId)
            {
                badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
                return Results.BadRequest(badRequestObject);
            }

            string token = string.Empty;
            //Generate Email confirm token
            token = _userTokenService.GenerateEmailConfirmationTokenAsync(user);

            if (!string.IsNullOrEmpty(token))
            {
                /*Send Email confirm callback code*/
                string callbackUrl = _configuration.GetSection("ApiFrontEnd").Value + $"/verify-email?id={user.Id.ToString()}&token={token}";
                if (callbackUrl != null)
                {
                    _emailSender.SendEmailConfirmationAsync(user.Email, callbackUrl);
                }
            }
            else
            {
                badRequestObject.Add(nameof(AC_SignUp_Error), AC_SignUp_Error);
                return Results.BadRequest(badRequestObject);
            }

            return Results.Ok(
                    new ApiResults<bool>()
                    {
                        Results = true,
                        Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
                    });
        }

        [HttpPatch]
        [Route("activate/{id}")]
        [Authorize(Policy = UserClaims.UserManagementUpdate)]
        public async Task<IResult> ActivateStatus(Guid id)
        {
            var webAppId = User.GetWebAppId();
            var badRequestObject = new BadRequestObject();
            if (string.IsNullOrWhiteSpace(webAppId))
            {
                badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
                return Results.BadRequest(badRequestObject);
            }
            var appId = Guid.Parse(webAppId);

            var user = await _userServices.FindUserAsync(id);
            if (user == null)
            {
                badRequestObject.Add(nameof(AC_Account_NotExist), AC_Account_NotExist);
                return Results.BadRequest(badRequestObject);
            }

            if (user.Status == UserStatus.Active)
            {
                badRequestObject.Add(nameof(AC_Account_Ready), AC_Account_Ready);
                return Results.BadRequest(badRequestObject);
            }

            if (user.ApplicationId != appId)
            {
                badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
                return Results.BadRequest(badRequestObject);
            }

            user.SetStatus(UserStatus.Active);
            var rowCount = await _userServices.UpdateUser(user, true);

            return Results.Accepted(nameof(ActivateStatus),
                new ApiResults<bool>()
                {
                    Results = rowCount > 0,
                    Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
                });
        }

        [HttpPatch]
        [Route("deactivate/{id}")]
        [Authorize(Policy = UserClaims.UserManagementUpdate)]
        public async Task<IResult> DeactivateStatus(Guid id)
        {
            var webAppId = User.GetWebAppId();
            var badRequestObject = new BadRequestObject();
            if (string.IsNullOrWhiteSpace(webAppId))
            {
                badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
                return Results.BadRequest(badRequestObject);
            }
            var appId = Guid.Parse(webAppId);

            var user = await _userServices.FindUserAsync(id);
            if (user == null)
            {
                badRequestObject.Add(nameof(AC_Account_NotExist), AC_Account_NotExist);
                return Results.BadRequest(badRequestObject);
            }

            if (user.Status == UserStatus.Inactive)
            {
                badRequestObject.Add(nameof(AC_Account_Ready), AC_Account_Ready);
                return Results.BadRequest(badRequestObject);
            }

            if (user.ApplicationId != appId)
            {
                badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
                return Results.BadRequest(badRequestObject);
            }

            user.SetStatus(UserStatus.Inactive);
            var rowCount = await _userServices.UpdateUser(user, true);

            return Results.Accepted(nameof(DeactivateStatus),
                new ApiResults<bool>()
                {
                    Results = rowCount > 0,
                    Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
                });
        }
    }
}
