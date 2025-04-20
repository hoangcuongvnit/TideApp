using Library.Domain;
using Microsoft.AspNetCore.Authorization;

namespace Library.ServiceDefaults
{
    public class PermissionRequirementHandler : AuthorizationHandler<PermissionRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            if (context.User.HasClaim(c => c.Type == AppClaimType.Permissions && c.Value.Contains(requirement.Permission)))
            {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;
        }
    }
}
