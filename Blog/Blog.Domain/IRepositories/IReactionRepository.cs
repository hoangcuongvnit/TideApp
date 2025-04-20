using Blog.Domain.Models;
using Library.Infrastructure.Interfaces;

namespace Blog.Domain.IRepositories
{
    public interface IReactionRepository : IRepository<Reaction>
    {
        Task<Reaction?> GetByIdAsync(Guid id);
    }
}
