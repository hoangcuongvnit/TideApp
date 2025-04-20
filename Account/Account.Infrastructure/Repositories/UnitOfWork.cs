using Account.Domain.IRepositories;

namespace Account.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AccountDatabaseContext _context;
        private readonly IUserRepository _user;
        private readonly IRoleRepository _role;
        private readonly IUserRoleRepository _userRole;
        private readonly IRoleClaimRepository _roleClaim;
        private readonly IUserLoginRepository _userLogin;
        private readonly IUserClaimRepository _userClaim;
        private readonly IUserTokenRepository _userToken;
        private readonly IWebApplicationRepository _webApplicationRepository;

        public IUserRepository User { get { return _user; } }
        public IRoleRepository Role { get { return _role; } }
        public IUserRoleRepository UserRole { get { return _userRole; } }
        public IRoleClaimRepository RoleClaim { get { return _roleClaim; } }
        public IUserLoginRepository UserLogin { get { return _userLogin; } }
        public IUserClaimRepository UserClaim { get { return _userClaim; } }
        public IUserTokenRepository UserToken { get { return _userToken; } }
        public IWebApplicationRepository WebApplication { get { return _webApplicationRepository; } }

        #region Function
        public UnitOfWork(AccountDatabaseContext databaseContext)
        {
            _context = databaseContext;
            _role = new RoleRepository(_context);
            _user = new UserRepository(_context);
            _userRole = new UserRoleRepository(_context);
            _roleClaim = new RoleClaimRepository(_context);
            _userLogin = new UserLoginRepository(_context);
            _userClaim = new UserClaimRepository(_context);
            _userToken = new UserTokenRepository(_context);
            _webApplicationRepository = new WebApplicationRepository(_context);
        }
        public int Save()
        {
            return _context.SaveChanges();
        }
        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
        #endregion

    }
}
