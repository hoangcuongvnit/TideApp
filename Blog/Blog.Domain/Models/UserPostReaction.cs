namespace Blog.Domain.Models
{
    public class UserPostReaction
    {
        public Guid UserId { get; }
        public virtual User User { get; }
        public Guid PostReactionId { get; }
        public virtual PostReaction PostReaction { get; }

        public UserPostReaction(Guid userId, Guid postReactionId)
        {
            UserId = userId;
            PostReactionId = postReactionId;
        }
    }
}
