using Blog.Domain.Models;
using Blog.Infrastructure.Helpers;
using Library.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Blog.Infrastructure
{
    public class BlogDatabaseContext : DbContext, IDatabaseContext
    {
        public BlogDatabaseContext(DbContextOptions<BlogDatabaseContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<PostReaction> PostReactions { get; set; }
        public DbSet<TagPost> TagPosts { get; set; }
        public DbSet<UserPostReaction> UserPostReactions { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Reaction> Reactions { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<PostCategory> PostCategories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            DatabaseHelper.OnModelEntity(modelBuilder);
        }
    }
}
