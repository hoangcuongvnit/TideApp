using Account.API.Dtos;
using Account.API.Extensions;
using Account.Application.Interfaces;
using Account.Domain.Dtos;
using AutoMapper;
using Core.Account.Models;
using Library.Claim;
using Library.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Account.Domain.Constants.DataDefault;

namespace Account.API.Controllers.Administrator
{
    [Route("api/adminuser")]
    [ApiController]
    [Authorize(Policy = UserClaims.UserManagementRoot)]
    public class AdminUserController : ControllerBase
    {
        private readonly IUserServices _userServices;
        private readonly IUserRoleService _userRoleService;
        private readonly IRoleService _roleService;
        private readonly IUserClaimService _userClaimService;
        private readonly IUserTokenService _userTokenService;
        private readonly IEmailSender _emailSender;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public AdminUserController(IUserServices userServices,
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
            if (model == null)
            {
                var badRequestObject = new BadRequestObject();
                badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
                return Results.BadRequest(badRequestObject);
            }

            if (model.Filter != null && !string.IsNullOrEmpty(model.Filter.Role))
            {
                var role = await _roleService.GetRoleByNameAsync(model.Filter.Role);
                if (role != null)
                {
                    model.Filter.SetRoleId(role.Id);
                }
            }

            var (users, total) = await _userServices.GetUsersAsync(model);
            var listUser = _mapper.Map<List<UserResultDto>>(users);
            foreach (var user in listUser)
            {
                user.RoleIds = users.Where(x => x.Id == user.Id && x.UserRoles != null)?.SelectMany(x => x.UserRoles).Select(x => x.RoleId).ToList() ?? null;
                user.IsEmailVerified = user.Status != UserStatus.AwaitingVerification;
            }

            var roles = await _roleService.GetRolesAsync();
            var listRole = _mapper.Map<List<RoleResultDto>>(roles);

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
            var user = await _userServices.GetUserAsync(id);
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

            var badRequestObject = new BadRequestObject();
            badRequestObject.Add(nameof(AC_Account_NotExist), AC_Account_NotExist);
            return Results.BadRequest(badRequestObject);
        }

        // POST api/<UserController>
        [HttpPost]
        public async Task<IResult> Post([FromBody] PostUserDto model)
        {
            var badRequestObject = new BadRequestObject();
            var isExisting = await _userServices.ValidateEmailIsExisting(model.Email);
            if (isExisting)
            {
                badRequestObject.Add(nameof(model.Email), nameof(AC_Email_Exist), AC_Email_Exist);
                return Results.BadRequest(badRequestObject);
            }

            //Create User
            var user = _mapper.Map<User>(model);
            user.SetStatus(UserStatus.Active);
            user.SetPasswordHash(model.Password);

            var roles = model.RoleIds != null && model.RoleIds.Count > 0 ?
                await _roleService.GetRolesByIdAsync(model.RoleIds)
                : null;
            //Check if user is owner then set application
            if (roles != null && roles.Any(x => x.Name == RoleDefault.Owner))
            {
                user.SetApplication(model.WebApplication);
            }
            //Check if user is not owner and not admin then set application
            else if (model.WebApplication != null && roles != null && !roles.Any(x => x.Name == RoleDefault.Administrator))
            {
                user.SetApplication(model.WebApplication);
            }

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
        public async Task<IResult> Put([FromBody] PutUserDto model)
        {
            return await UpdateUser(model);
        }

        [HttpPut]
        [Route("password")]
        public async Task<IResult> Put([FromBody] PutUserWithPasswordDto model)
        {
            return await UpdateUser(model, model.Password);
        }

        // DELETE api/<UserController>/5
        [HttpDelete]
        [Route("{id}")]
        public async Task<IResult> Delete(Guid id)
        {
            var rowCount = await _userServices.DeleteUser(id, true);

            return Results.Accepted(nameof(Delete),
                new ApiResults<bool>()
                {
                    Results = rowCount > 0,
                    Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
                });
        }

        private async Task<IResult> UpdateUser(PutUserDto model, string? password = null)
        {
            var badRequestObject = new BadRequestObject();
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
        public async Task<IResult> ResendVerifyEmail(Guid id)
        {
            var badRequestObject = new BadRequestObject();
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
        public async Task<IResult> ActivateStatus(Guid id)
        {
            var user = await _userServices.FindUserAsync(id);
            if (user == null)
            {
                var badRequestObject = new BadRequestObject();
                badRequestObject.Add(nameof(AC_Account_NotExist), AC_Account_NotExist);
                return Results.BadRequest(badRequestObject);
            }

            if (user.Status == UserStatus.Active)
            {
                var badRequestObject = new BadRequestObject();
                badRequestObject.Add(nameof(AC_Account_Ready), AC_Account_Ready);
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
        public async Task<IResult> DeactivateStatus(Guid id)
        {
            var user = await _userServices.FindUserAsync(id);
            if (user == null)
            {
                var badRequestObject = new BadRequestObject();
                badRequestObject.Add(nameof(AC_Account_NotExist), AC_Account_NotExist);
                return Results.BadRequest(badRequestObject);
            }

            if (user.Status == UserStatus.Inactive)
            {
                var badRequestObject = new BadRequestObject();
                badRequestObject.Add(nameof(AC_Account_Ready), AC_Account_Ready);
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

        // Get api/user/statistic
        [HttpGet]
        [Route("statistic")]
        public async Task<IResult> Statistic()
        {
            var users = await _userServices.GetUserStatistic();

            var totalUser = users.Count;
            var totalActiveUser = users.Where(x => x.Status == UserStatus.Active).Count();
            var totalInactiveUser = users.Where(x => x.Status == UserStatus.Inactive || x.Status == UserStatus.PendingApproval).Count();
            var totalDeletedUser = users.Where(x => x.Status == UserStatus.Deleted).Count();
            var totalNeedVerifyUser = users.Where(x => x.Status == UserStatus.AwaitingVerification).Count();
            var totalWebApplication = users.Where(x => x.Status == UserStatus.Active && x.WebApplicationId != null)
                .Select(x => x.WebApplicationId)
                .Distinct()
                .Count();

            var data = new UserStatisticResultDto()
            {
                Total = totalUser,
                TotalActive = totalActiveUser,
                TotalInactive = totalInactiveUser,
                TotalDeleted = totalDeletedUser,
                TotalAwaiting = totalNeedVerifyUser,
                TotalWebAppActive = totalWebApplication
            };

            return Results.Ok(
                new ApiResults<UserStatisticResultDto>()
                {
                    Results = data,
                    Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
                });
        }


    }
}
