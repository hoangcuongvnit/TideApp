namespace Blog.Domain.Models
{
    public class PostCategory(Guid categoryId, Guid postId)
    {
        public Guid CategoryId { get; private set; } = categoryId;
        public virtual Category? Category { get; private set; }
        public Guid PostId { get; private set; } = postId;
        public virtual Post? Post { get; private set; }
    }
}
