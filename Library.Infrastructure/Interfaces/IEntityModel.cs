using System.ComponentModel.DataAnnotations;

namespace Library.Infrastructure.Interfaces
{
    public interface IEntityModel
    {
        [Key]
        [Required]
        public Guid Id { get; }
    }
}
