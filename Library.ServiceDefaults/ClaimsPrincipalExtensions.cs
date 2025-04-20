using Library.Domain;
using System.Security.Claims;

namespace Library.ServiceDefaults;

public static class ClaimsPrincipalExtensions
{
    public static string? GetUserId(this ClaimsPrincipal principal)
        => principal.FindFirst(AppClaimType.Id)?.Value;

    public static string? GetWebAppId(this ClaimsPrincipal principal)
        => principal.FindFirst(AppClaimType.WebAppId)?.Value;

    public static string? GetUserName(this ClaimsPrincipal principal) =>
        principal.FindFirst(x => x.Type == ClaimTypes.Name)?.Value;
}
