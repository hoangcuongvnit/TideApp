namespace Library.Domain
{
    public class TokenConfiguration
    {
        public string Secret { get; set; } = string.Empty;
        public int Lifetime { get; set; } = 12;
        public string Audience { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
    }
}
