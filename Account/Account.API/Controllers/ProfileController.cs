using Account.API.Dtos;
using Account.Application.Interfaces;
using AutoMapper;
using Library.ServiceDefaults;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Account.API.Controllers
{
    [Route("api/profile")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IUserServices _userServices;
        private readonly IMapper _mapper;

        public ProfileController(IUserServices userServices,
            IMapper mapper)
        {
            _userServices = userServices;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IResult> Get()
        {
            var badRequestObject = new BadRequestObject();
            var userId = User.GetUserId();
            if (userId == null)
            {
                badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
                return Results.BadRequest(badRequestObject);
            }

            var id = Guid.Parse(userId);
            var user = await _userServices.FindUserAsync(id);

            if (user != null && user.Id == id)
            {
                var userResult = _mapper.Map<UserResultDto>(user);
                return Results.Ok(
                    new ApiResults<UserResultDto>()
                    {
                        Results = userResult,
                        Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
                    });
            }

            badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
            return Results.BadRequest(badRequestObject);
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

        [HttpPut]
        [Route("change-password")]
        public async Task<IResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            var badRequestObject = new BadRequestObject();
            var userId = User.GetUserId();
            var id = !string.IsNullOrEmpty(userId) ? Guid.Parse(userId) : Guid.Empty;
            if (id == Guid.Empty)
            {
                badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
                return Results.BadRequest(badRequestObject);
            }

            var user = await _userServices.FindUserAsync(id);
            if (user == null || user.Id == Guid.Empty || string.IsNullOrEmpty(user.Email))
            {
                badRequestObject.Add(nameof(AC_Account_NotExist), AC_Account_NotExist);
                return Results.BadRequest(badRequestObject);
            }

            var isPasswordValid = user.VerifyPassword(model.CurrentPassword);
            if (!isPasswordValid)
            {
                badRequestObject.Add(nameof(model.CurrentPassword), nameof(AC_Password_NotMatch), AC_Password_NotMatch);
                return Results.BadRequest(badRequestObject);
            }

            user.SetPasswordHash(model.NewPassword);
            var rowCount = await _userServices.UpdateUser(user, true);

            return Results.Accepted(nameof(ChangePasswordDto),
                new ApiResults<bool>()
                {
                    Results = rowCount > 0,
                    Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
                });
        }

        private async Task<IResult> UpdateUser(PutUserDto model, string? password = null)
        {
            var badRequestObject = new BadRequestObject();
            var userId = User.GetUserId();
            var id = !string.IsNullOrEmpty(userId) ? Guid.Parse(userId) : Guid.Empty;
            if (id == Guid.Empty)
            {
                badRequestObject.Add(nameof(AC_RequestFailed), AC_RequestFailed);
                return Results.BadRequest(badRequestObject);
            }

            var oldUser = await _userServices.FindUserAsync(id);
            if (oldUser == null || oldUser.Id == Guid.Empty || string.IsNullOrEmpty(oldUser.Email))
            {
                badRequestObject.Add(nameof(AC_Account_NotExist), AC_Account_NotExist);
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

            return Results.Accepted(nameof(PostUserDto),
                new ApiResults<bool>()
                {
                    Results = rowCount > 0,
                    Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
                });
        }
    }
}
