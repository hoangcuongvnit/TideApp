using Account.API.Dtos;
using Account.Application.Interfaces;
using Account.Domain.Models;
using AutoMapper;
using Library.Claim;
using Library.Claim.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Account.Domain.Constants.DataDefault;

namespace Account.API.Controllers
{
    [Route("api")]
    [ApiController]
    public class RoleController : Controller
    {
        private readonly IRoleService _roleService;
        private readonly IRoleClaimService _roleClaimService;
        private readonly IMapper _mapper;
        private readonly IEnumerable<IClaim> _claims;

        public RoleController(IRoleService roleService, IMapper mapper, IEnumerable<IClaim> claims, IRoleClaimService roleClaimService)
        {
            _roleService = roleService;
            _mapper = mapper;
            _claims = claims;
            _roleClaimService = roleClaimService;
        }

        [HttpGet]
        [Route("roles")]
        [Authorize(Policy = UserClaims.UserManagementRoot)]
        public async Task<IResult> GetRoles()
        {
            var roles = await _roleService.GetRolesAsync();
            var listRole = _mapper.Map<List<RoleResultDto>>(roles);

            return Results.Ok(
                new ApiResults<List<RoleResultDto>>()
                {
                    Results = listRole,
                    Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
                });
        }

        [HttpGet]
        [Route("role/claims")]
        [Authorize(Policy = UserClaims.UserManagementRoot)]
        public IResult GetClaims()
        {
            List<string> claims = new List<string>();
            foreach (var claim in _claims)
            {
                claims.AddRange(claim.GetClaims());
            }

            return Results.Ok(
                new ApiResults<List<string>?>()
                {
                    Results = claims,
                    Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
                });
        }

        [HttpGet]
        [Route("role/webapp/all")]
        public async Task<IResult> GetWebappRoles()
        {
            var roles = await _roleService.GetRolesAsync();
            var listRole = _mapper.Map<List<RoleResultDto>>(roles);
            listRole = listRole.Where(x => x.Name != RoleDefault.Administrator).ToList();

            return Results.Ok(
                new ApiResults<List<RoleResultDto>>()
                {
                    Results = listRole,
                    Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
                });
        }

        [HttpGet]
        [Route("role/webapp/claims")]
        public IResult GetWebappClaims()
        {
            List<string> claims = new List<string>();
            foreach (var claim in _claims)
            {
                claims.AddRange(claim.GetClaims());
            }
            claims = claims.Where(x => !x.Contains("Root")).ToList();

            return Results.Ok(
                new ApiResults<List<string>?>()
                {
                    Results = claims,
                    Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
                });
        }

        /// <summary>
        /// This api only for check and add role claims for administrator role
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("check-administatorrole-claims")]
        public async Task<IResult> CheckRoleClaim()
        {
            //Get all claims
            List<string> claims = new List<string>();
            foreach (var claim in _claims)
            {
                claims.AddRange(claim.GetClaims());
            }

            //Get all roles
            var administratorRole = await _roleService.GetRoleClaimsByNameAsync(RoleDefault.Administrator);

            if (administratorRole != null && claims != null && claims.Count > 0)
            {
                var roleClaims = new List<RoleClaim>();
                foreach (var claim in claims)
                {
                    if (administratorRole.RoleClaims?.Any(x => x.ClaimValue == claim) != true)
                    {
                        roleClaims.Add(new RoleClaim(administratorRole.Id, AppClaimType.Permissions, claim));
                    }
                }

                if (roleClaims.Count > 0)
                {
                    await _roleClaimService.AddRoleClaimsAsync(roleClaims, true);
                }
            }

            return Results.Ok();
        }
    }
}
