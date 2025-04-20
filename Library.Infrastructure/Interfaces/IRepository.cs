using System.Linq.Expressions;

namespace Library.Infrastructure.Interfaces
{
    public interface IRepository<TEntity>
    {
        /// <summary>
        /// Get entity by primary key with tracking
        /// </summary>
        /// <param name="keyValues"></param>
        /// <returns></returns>
        Task<TEntity?> FindAsync(params object[] keyValues);
        /// <summary>
        /// Get all entities without tracking
        /// </summary>
        /// <returns></returns>
        IQueryable<TEntity> GetWithOutTrackingAll();
        IQueryable<TEntity> FindByCondition(Expression<Func<TEntity, bool>> expression);
        IQueryable<TEntity> GetByConditionWithOutTracking(Expression<Func<TEntity, bool>> expression);
        Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> expression);
        Task<TEntity?> FirstOrDefaultWithOutTrackingAsync(Expression<Func<TEntity, bool>> expression);
        void Insert(TEntity entity);
        void InsertRange(IEnumerable<TEntity> entities);
        void Update(TEntity entity);
        void UpdateRange(IEnumerable<TEntity> entities);
        void Delete(TEntity entity);
        void DeleteRange(IEnumerable<TEntity> entities);
    }
}
