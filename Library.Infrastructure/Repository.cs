using Library.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Library.Infrastructure
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        protected IDatabaseContext DatabaseContext { get; set; }
        protected DbSet<TEntity> _dbSet;

        public Repository(IDatabaseContext repositoryContext)
        {
            DatabaseContext = repositoryContext;
            _dbSet = DatabaseContext.Set<TEntity>();
        }

        public async Task<TEntity?> FindAsync(params object[] keyValues)
        {
            return await _dbSet.FindAsync(keyValues);
        }

        public IQueryable<TEntity> GetWithOutTrackingAll()
        {
            return _dbSet.AsNoTracking();
        }

        public IQueryable<TEntity> FindByCondition(Expression<Func<TEntity, bool>> expression)
        {
            return _dbSet.Where(expression);
        }

        public IQueryable<TEntity> GetByConditionWithOutTracking(Expression<Func<TEntity, bool>> expression)
        {
            return _dbSet.Where(expression).AsNoTracking();
        }
        public async Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> expression)
        {
            return await _dbSet.FirstOrDefaultAsync(expression);
        }

        public async Task<TEntity?> FirstOrDefaultWithOutTrackingAsync(Expression<Func<TEntity, bool>> expression)
        {
            return await _dbSet.AsNoTracking().FirstOrDefaultAsync(expression);
        }

        public void Insert(TEntity entity)
        {
            _dbSet.Add(entity);
        }

        public void InsertRange(IEnumerable<TEntity> entities)
        {
            _dbSet.AddRange(entities);
        }

        public void Update(TEntity entity)
        {
            _dbSet.Update(entity);
        }
        public virtual void UpdateRange(IEnumerable<TEntity> entities)
        {
            DatabaseContext.UpdateRange(entities);
        }

        public void Delete(TEntity entity)
        {
            _dbSet.Remove(entity);
        }
        public void DeleteRange(IEnumerable<TEntity> entities)
        {
            _dbSet.RemoveRange(entities);
        }
    }
}
