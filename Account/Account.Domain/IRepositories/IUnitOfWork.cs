namespace Account.Domain.IRepositories
{
    public interface IUnitOfWork
    {
        IUserRepository User { get; }
        IRoleRepository Role { get; }
        IUserRoleRepository UserRole { get; }
        IRoleClaimRepository RoleClaim { get; }
        IUserLoginRepository UserLogin { get; }
        IUserClaimRepository UserClaim { get; }
        IUserTokenRepository UserToken { get; }
        IWebApplicationRepository WebApplication { get; }

        int Save();
        Task<int> SaveChangesAsync();
    }
}
