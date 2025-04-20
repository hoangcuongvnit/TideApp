using System.ComponentModel.DataAnnotations;

namespace Blog.Domain.Models
{
    public class Category
    {
        [Key]
        public Guid Id { get; private set; }
        public string Title { get; private set; }
        public string Description { get; private set; }
        public string Url { get; private set; }
        public Guid? ParentId { get; private set; }
        public Category? Parent { get; private set; }

        // Primary constructor
        public Category(Guid id, string title, string description, string url, Guid? parentId = null, Category? parent = null)
        {
            Id = id;
            Title = title;
            Description = description;
            Url = url;
            ParentId = parentId;
            Parent = parent;
        }

        // Parameterless constructor for EF
        public Category() : this(Guid.Empty, string.Empty, string.Empty, string.Empty) { }
    }
}
