using System.ComponentModel.DataAnnotations;

namespace Blog.Domain.Models
{
    public class PostReaction
    {
        [Key]
        public Guid Id { get; }
        [Required]
        public Guid PostId { get; }
        [Required]
        public Guid ReactionId { get; } // Changed type to Guid to match Reaction.Id
        public float Total { get; private set; } = 0;
        public virtual Post Post { get; }
        public virtual Reaction Reaction { get; }

        public PostReaction(Guid postId, Guid reactionId) // Updated parameter type
        {
            PostId = postId;
            ReactionId = reactionId;
        }

        public void AddReaction()
        {
            Total++;
        }
    }
}
