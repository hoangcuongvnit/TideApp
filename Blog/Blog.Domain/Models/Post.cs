using Library.Infrastructure.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace Blog.Domain.Models
{
    public class Post : IEntityModel
    {
        [Key]
        public Guid Id { get; }
        public string Title { get; }
        public string Content { get; }
        public Guid AuthorId { get; }
        public virtual User Author { get; }
        public DateTimeOffset? CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }

        public Post(Guid id, string title, string content, Guid authorId, User author)
        {
            Id = id;
            Title = title;
            Content = content;
            AuthorId = authorId;
            Author = author;
            CreatedAt = DateTimeOffset.Now;
            UpdatedAt = DateTimeOffset.Now;
        }

        public Post(Guid id, string title, string content, Guid authorId)
        {
            Id = id;
            Title = title;
            Content = content;
            AuthorId = authorId;
            CreatedAt = DateTimeOffset.Now;
            UpdatedAt = DateTimeOffset.Now;
        }
    }
}
