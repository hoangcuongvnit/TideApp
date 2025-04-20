namespace Library.Claim.Infrastructure
{
    public interface IClaim
    {
        IEnumerable<string> GetClaims();
    }
}
