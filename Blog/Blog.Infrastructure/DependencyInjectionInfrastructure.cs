using Blog.Domain.IRepositories;
using Blog.Infrastructure.Repositories;
using Library.Infrastructure;
using Library.Infrastructure.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace Blog.Infrastructure
{
    public static class DependencyInjectionInfrastructure
    {
        public static void InjectionInfrastructure(this IServiceCollection services)
        {
            //Scoped Repository Entity
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            //Scoped Repository Database Context
            services.AddScoped<IDatabaseContext, BlogDatabaseContext>();
            //Scoped Repository
            services.AddScoped<IPostRepository, PostRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<ITagRepository, TagRepository>();
            services.AddScoped<IUserPostReactionRepository, UserPostReactionRepository>();
            services.AddScoped<IUserPostReactionRepository, UserPostReactionRepository>();
            services.AddScoped<IPostReactionRepository, PostReactionRepository>();
            services.AddScoped<ITagPostRepository, TagPostRepository>();
        }
    }
}
