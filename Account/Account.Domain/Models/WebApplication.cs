using Library.Infrastructure.Interfaces;

namespace Account.Domain.Models
{
    public class WebApplication : IEntityModel
    {
        private readonly string _dateCode = DateTime.Now.ToString("yyMMddhhmmss");
        public WebApplication()
        {
            Id = Guid.NewGuid();
            Name = _dateCode;
            Code = GenerateName();
            CreatedAt = DateTimeOffset.UtcNow;
            UpdatedAt = DateTimeOffset.UtcNow;
        }

        public WebApplication(string name, string description)
        {
            Id = Guid.NewGuid();
            Name = name;
            Code = GenerateName();
            Description = description;
            CreatedAt = DateTimeOffset.UtcNow;
            UpdatedAt = DateTimeOffset.UtcNow;
        }

        private string GenerateName()
        {
            const string letters = "abcdefghiklmnopqrstuvwxyz";
            const string numbers = "0123456789";

            var random = new Random();
            var securityStampLetters = new string(Enumerable.Repeat(letters, 8)
              .Select(s => s[random.Next(s.Length)]).ToArray());
            var securityStampNumber = new string(Enumerable.Repeat(numbers, 5)
              .Select(s => s[random.Next(s.Length)]).ToArray());

            return $"L{securityStampLetters}N{securityStampNumber}T{_dateCode}";
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string? Description { get; set; }
        public string? Logo { get; set; }
        public DateTimeOffset? CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
    }
}
