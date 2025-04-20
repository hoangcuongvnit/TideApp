using Blog.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Blog.Infrastructure.Helpers
{
    public static class DatabaseHelper
    {
        public static void InitializerDatabase(this IServiceCollection services)
        {
            services.AddOpenTelemetry()
                .WithTracing(tracing => tracing.AddSource(BlogDbInitializer.ActivitySourceName));

            services.AddSingleton<BlogDbInitializer>();
            services.AddHostedService(sp => sp.GetRequiredService<BlogDbInitializer>());
            services.AddHealthChecks()
                .AddCheck<BlogDbInitializerHealthCheck>("DbInitializer", null);
        }
        public static void OnModelEntity(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.DisplayName).IsRequired();

                entity.ToTable("Users");
            });

            modelBuilder.Entity<Post>(entity =>
            {
                entity.ToTable("Post");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired();
                entity.Property(e => e.Content).IsRequired();
                entity.HasOne(e => e.Author).WithMany().HasForeignKey(e => e.AuthorId);
            });

            modelBuilder.Entity<Tag>(entity =>
            {
                entity.ToTable("Tag");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired();
            });

            modelBuilder.Entity<PostReaction>(entity =>
            {
                entity.ToTable("PostReaction");
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Post).WithMany().HasForeignKey(e => e.PostId);
                entity.HasOne(e => e.Reaction).WithMany().HasForeignKey(e => e.ReactionId);
            });

            modelBuilder.Entity<TagPost>(entity =>
            {
                entity.ToTable("TagPost");
                entity.HasKey(e => new { e.TagId, e.PostId });
                entity.HasOne(e => e.Tag).WithMany().HasForeignKey(e => e.TagId);
                entity.HasOne(e => e.Post).WithMany().HasForeignKey(e => e.PostId);
            });

            modelBuilder.Entity<UserPostReaction>(entity =>
            {
                entity.ToTable("UserPostReaction");
                entity.HasKey(e => new { e.UserId, e.PostReactionId });
                entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId);
                entity.HasOne(e => e.PostReaction).WithMany().HasForeignKey(e => e.PostReactionId);
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("Category");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired();
            });

            modelBuilder.Entity<Reaction>(entity =>
            {
                entity.ToTable("Reaction");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired();
            });

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.ToTable("Comment");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Content).IsRequired();
                entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId);
                entity.HasOne(e => e.Post).WithMany().HasForeignKey(e => e.PostId);
            });

            modelBuilder.Entity<PostCategory>(entity =>
            {
                entity.ToTable("PostCategory");
                entity.HasKey(e => new { e.CategoryId, e.PostId });
                entity.HasOne(e => e.Category).WithMany().HasForeignKey(e => e.CategoryId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Post).WithMany().HasForeignKey(e => e.PostId).OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
