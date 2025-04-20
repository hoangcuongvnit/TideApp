using System.ComponentModel.DataAnnotations;

namespace Blog.Domain.Models
{
    public class Tag(Guid id, string name, string url)
    {
        [Key]
        public Guid Id { get; private set; } = id;

        [Required]
        public string Name { get; private set; } = name;

        public string Url { get; private set; } = url;
    }
}
