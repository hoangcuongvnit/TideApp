namespace Blog.Domain.Models
{
    public class TagPost(Guid tagId, Guid postId)
    {
        public Guid TagId { get; } = tagId;
        public virtual Tag? Tag { get; }
        public Guid PostId { get; } = postId;
        public virtual Post? Post { get; }
    }
}
