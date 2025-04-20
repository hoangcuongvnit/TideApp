using System.ComponentModel.DataAnnotations;

namespace Blog.Domain.Models
{
    public class Reaction
    {
        [Key]
        public Guid Id { get; private set; }
        [Required]
        public string Name { get; private set; }
        public string Icon { get; private set; }

        private Reaction() { } // Parameterless constructor for EF Core

        public Reaction(Guid id, string name, string icon)
        {
            Id = id;
            Name = name;
            Icon = icon;
        }
    }
}
