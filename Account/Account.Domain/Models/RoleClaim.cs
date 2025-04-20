using Library.Infrastructure.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace Account.Domain.Models
{
    public class RoleClaim : IEntityModel
    {
        public RoleClaim(Guid roleId, string claimType, string claimValue)
        {
            Id = Guid.NewGuid();
            RoleId = roleId;
            ClaimType = claimType;
            ClaimValue = claimValue;
        }

        public Guid Id { get; set; }
        public Guid RoleId { get; set; }

        [Required]
        [StringLength(120)]
        public string ClaimType { get; set; }

        [Required]
        [StringLength(120)]
        public string ClaimValue { get; set; }

        public virtual Role? Role { get; set; }
    }
}
