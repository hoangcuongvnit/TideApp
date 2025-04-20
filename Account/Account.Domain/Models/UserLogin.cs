using Core.Account.Models;
using Library.Infrastructure.Interfaces;

namespace Account.Domain.Models
{
    public class UserLogin : IEntityModel
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string LoginProvider { get; set; } = string.Empty;
        public string ProviderKey { get; set; } = string.Empty;
        public string ProviderDisplayName { get; set; } = string.Empty;
        public virtual User? User { get; set; }
    }
}
