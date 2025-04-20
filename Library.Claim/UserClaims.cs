using Library.Claim.Infrastructure;

namespace Library.Claim
{
    public class UserClaims : ClaimBase
    {
        public const string UserManagementRoot = "UserManagementRoot";
        public const string UserManagementView = "UserManagementView";
        public const string UserManagementCreate = "UserManagementCreate";
        public const string UserManagementUpdate = "UserManagementUpdate";
        public const string UserManagementDelete = "UserManagementDelete";

        /// <summary>
        /// Returns all the claims
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<string> Claims() => new UserClaims().GetClaims();
    }
}
