using Library.Domain;

namespace Account.Domain.Dtos
{
    public class UserFilterDto
    {
        public string? Role { get; set; }
        public Guid? RoleId { get; private set; }
        public Guid? AppId { get; private set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public UserStatus? Status { get; set; }

        public void SetRoleId(Guid roleId)
        {
            RoleId = roleId;
        }

        public void SetAppId(Guid appId)
        {
            AppId = appId;
        }
    }
}
