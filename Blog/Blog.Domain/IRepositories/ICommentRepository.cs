using Blog.Domain.Models;
using Library.Infrastructure.Interfaces;

namespace Blog.Domain.IRepositories
{
    public interface ICommentRepository : IRepository<Comment>
    {
        Task<Comment?> GetByIdAsync(Guid id);
    }
}
