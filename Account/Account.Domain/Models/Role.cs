using Library.Infrastructure.Interfaces;

namespace Account.Domain.Models
{
    public class Role : IEntityModel
    {
        public Role(string name, string localeKey, int order = 5)
        {
            Id = Guid.NewGuid();
            Name = name;
            LocaleKey = localeKey;
            Order = order;
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string LocaleKey { get; set; }
        public int Order { get; set; }
        public virtual ICollection<UserRole>? UserRoles { get; set; }
        public virtual ICollection<RoleClaim>? RoleClaims { get; set; }
    }
}
