using Core.Account.Models;
using Library.Infrastructure.Interfaces;

namespace Account.Domain.Models
{
    public class UserToken : IEntityModel
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string LoginProvider { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public DateTimeOffset? Expires { get; set; }
        public DateTimeOffset? CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public virtual User? User { get; set; }
    }
}
