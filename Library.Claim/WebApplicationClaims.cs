using Library.Claim.Infrastructure;

namespace Library.Claim
{
    public class WebApplicationClaims : ClaimBase
    {
        public const string WebApplicationView = "WebApplicationView";

        /// <summary>
        /// Returns all the claims
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<string> Claims() => new WebApplicationClaims().GetClaims();
    }
}
