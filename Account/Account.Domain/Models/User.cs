using Account.Domain.Models;
using Library.Domain;
using Library.Infrastructure.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace Core.Account.Models
{
    public partial class User : IEntityModel
    {
        [Key]
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Email { get; private set; }
        public string UserName { get; private set; }
        public string NormalizedEmail { get; private set; }
        public string? PhoneNumber { get; set; }
        public string? DisplayName { get; set; }
        public UserStatus Status { get; set; }
        public string? Avatar { get; set; }
        public string? ProfileUrl { get; set; }
        public string? Description { get; set; }
        public string? Title { get; set; }
        public Guid? ApplicationId { get; set; }
        public string? Address { get; set; }
        public DateTime? BirthDate { get; set; }
        public DateTimeOffset? CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        public string? PasswordHash { get; private set; }
        public string SecurityStamp { get; private set; }
        public bool EmailConfirmed { get; set; } = false;
        public bool PhoneNumberConfirmed { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public int AccessFailedCount { get; private set; }

        public virtual ICollection<UserClaim>? Claims { get; set; }
        public virtual ICollection<UserLogin>? Logins { get; set; }
        public virtual ICollection<UserToken>? Tokens { get; set; }
        public virtual ICollection<UserRole>? UserRoles { get; set; }
        public virtual WebApplication? Application { get; set; }
    }
}