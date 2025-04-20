namespace Blog.Domain.IRepositories
{
    public interface IUnitOfWork
    {
        ICategoryRepository CategoryRepository { get; }
        IPostRepository PostRepository { get; }
        ITagRepository TagRepository { get; }
        ICommentRepository CommentRepository { get; }
        IPostCategoryRepository PostCategoryRepository { get; }
        IUserRepository UserRepository { get; }
        IReactionRepository ReactionRepository { get; }
        IPostReactionRepository PostReactionRepository { get; }
        ITagPostRepository TagPostRepository { get; }
        IUserPostReactionRepository UserPostReactionRepository { get; }

        int Save();
        Task<int> SaveChangesAsync();
    }
}
