using Microsoft.EntityFrameworkCore;

namespace Library.Infrastructure.Interfaces
{
    public interface IDatabaseContext
    {
        DbSet<TEntity> Set<TEntity>() where TEntity : class;
        void UpdateRange(IEnumerable<object> entities);
    }
}
