using Library.Infrastructure.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace Blog.Domain.Models
{
    public class Comment : IEntityModel
    {
        [Key]
        public Guid Id { get; }
        public string Content { get; }
        public Guid PostId { get; }
        public Guid UserId { get; }
        public virtual Post Post { get; }
        public virtual User User { get; }
        public DateTimeOffset? CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }

        public Comment(Guid id, string content, Guid postId, Guid userId, Post post, User user)
        {
            Id = id;
            Content = content;
            PostId = postId;
            UserId = userId;
            Post = post;
            User = user;
            CreatedAt = DateTimeOffset.Now;
            UpdatedAt = DateTimeOffset.Now;
        }

        public Comment(Guid id, string content, Guid postId, Guid userId)
        {
            Id = id;
            Content = content;
            PostId = postId;
            UserId = userId;
            CreatedAt = DateTimeOffset.Now;
            UpdatedAt = DateTimeOffset.Now;
        }
    }
}
