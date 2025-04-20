using Library.Claim.Infrastructure;

namespace Library.Claim
{
    public class BlogClaims : ClaimBase
    {
        public const string BlogManagementRoot = "BlogManagementRoot";
        public const string BlogManagementView = "BlogManagementView";
        public const string BlogManagementCreate = "BlogManagementCreate";
        public const string BlogManagementUpdate = "BlogManagementUpdate";
        public const string BlogManagementDelete = "BlogManagementDelete";

        /// <summary>
        /// Returns all the claims
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<string> Claims() => new BlogClaims().GetClaims();
    }
}
