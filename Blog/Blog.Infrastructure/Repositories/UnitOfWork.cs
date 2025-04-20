using Blog.Domain.IRepositories;

namespace Blog.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly BlogDatabaseContext _context;
        private readonly IPostRepository _post;
        private readonly ICommentRepository _comment;
        private readonly ICategoryRepository _category;
        private readonly ITagRepository _tag;
        private readonly ITagPostRepository _tagPost;
        private readonly IPostCategoryRepository _postCategory;
        private readonly IReactionRepository _reaction;
        private readonly IPostReactionRepository _postReaction;
        private readonly IUserRepository _user;
        private readonly IUserPostReactionRepository _userPostReaction;

        public IUserRepository UserRepository { get { return _user; } }
        public IPostRepository PostRepository { get { return _post; } }
        public ICommentRepository CommentRepository { get { return _comment; } }
        public ICategoryRepository CategoryRepository { get { return _category; } }
        public ITagRepository TagRepository { get { return _tag; } }
        public ITagPostRepository TagPostRepository { get { return _tagPost; } }
        public IPostCategoryRepository PostCategoryRepository { get { return _postCategory; } }
        public IReactionRepository ReactionRepository { get { return _reaction; } }
        public IPostReactionRepository PostReactionRepository { get { return _postReaction; } }
        public IUserPostReactionRepository UserPostReactionRepository { get { return _userPostReaction; } }

        #region Function
        public UnitOfWork(BlogDatabaseContext databaseContext)
        {
            _context = databaseContext;
            _post = new PostRepository(_context);
            _comment = new CommentRepository(_context);
            _category = new CategoryRepository(_context);
            _tag = new TagRepository(_context);
            _tagPost = new TagPostRepository(_context);
            _postCategory = new PostCategoryRepository(_context);
            _reaction = new ReactionRepository(_context);
            _postReaction = new PostReactionRepository(_context);
            _user = new UserRepository(_context);
            _userPostReaction = new UserPostReactionRepository(_context);
        }

        public int Save()
        {
            return _context.SaveChanges();
        }
        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
        public void Dispose()
        {
            _context.Dispose();
        }
        #endregion
    }
}
