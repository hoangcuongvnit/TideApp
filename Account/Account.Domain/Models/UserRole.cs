using Core.Account.Models;
using System.ComponentModel.DataAnnotations;

namespace Account.Domain.Models
{
    public class UserRole
    {
        public UserRole(Guid userId, Guid roleId)
        {
            UserId = userId;
            RoleId = roleId;
        }

        [Key]
        public Guid UserId { get; set; }
        [Key]
        public Guid RoleId { get; set; }
        public virtual User User { get; set; }
        public virtual Role Role { get; set; }
    }
}
