using Core.Account.Models;
using Library.Infrastructure.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace Account.Domain.Models
{
    public class UserClaim : IEntityModel
    {
        public UserClaim(Guid userId, string claimType, string claimValue)
        {
            Id = Guid.NewGuid();
            UserId = userId;
            ClaimType = claimType;
            ClaimValue = claimValue;
        }

        public Guid Id { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        [StringLength(120)]
        public string ClaimType { get; set; }
        [Required]
        [StringLength(120)]
        public string ClaimValue { get; set; }
        public virtual User? User { get; set; }
    }
}
