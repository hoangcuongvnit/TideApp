using Library.Infrastructure.Interfaces;

namespace Blog.Domain.Models
{
    public class User : IEntityModel
    {
        [Obsolete("For EF Core use only", true)]
        public User() { }

        public User(Guid id, string name)
        {
            Id = id;
            DisplayName = name;
        }

        public Guid Id { get; }
        public string DisplayName { get; }
    }
}
