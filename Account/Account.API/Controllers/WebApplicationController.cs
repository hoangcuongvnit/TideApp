using Account.API.Dtos;
using Account.Application.Interfaces;
using AutoMapper;
using Library.Claim;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Account.API.Controllers
{
    [Route("api/webapp")]
    [ApiController]
    [Authorize(Policy = WebApplicationClaims.WebApplicationView)]
    public class WebApplicationController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IWebApplicationService _webApplicationService;
        public WebApplicationController(IMapper mapper, IWebApplicationService webApplication)
        {
            _mapper = mapper;
            _webApplicationService = webApplication;
        }

        [HttpGet]
        [Route("all")]
        public async Task<IResult> GetWebApplications()
        {
            var webApplications = await _webApplicationService.GetAllAsync();
            var webApps = webApplications.Select(x => new WebAppResultDto(x.Id, x.Name, x.Code, x.Description)).ToList();

            return Results.Ok(
                new ApiResults<List<WebAppResultDto>>()
                {
                    Results = webApps,
                    Messages = new ApiResultMessage(nameof(AC_RequestSuccessfully), AC_RequestSuccessfully)
                });
        }
    }
}
