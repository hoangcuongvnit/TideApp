using Account.Domain.Models;
using Library.Domain;
using System.Security.Cryptography;
using System.Text;

namespace Core.Account.Models
{
    public partial class User
    {
        public User(string email)
        {
            Id = Guid.NewGuid();
            Email = email;
            UserName = email;
            NormalizedEmail = email.ToUpper();
            SecurityStamp = GenerateSecurityStamp();
            Status = UserStatus.AwaitingVerification;
            AccessFailedCount = 0;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public User(string email, string? phoneNumber, string? displayName, string? avatar, string? profileUrl,
            string? description, string? title, string? address, DateTime? birthDate)
        {
            Id = Guid.NewGuid();
            Email = email;
            NormalizedEmail = email.ToUpper();
            UserName = email;
            PhoneNumber = phoneNumber;
            DisplayName = displayName;
            Avatar = avatar;
            ProfileUrl = profileUrl;
            Description = description;
            Title = title;
            Address = address;
            BirthDate = birthDate;
            Status = UserStatus.AwaitingVerification;
            AccessFailedCount = 0;
            SecurityStamp = GenerateSecurityStamp();
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public void IncreaseAccessFailedCount()
        {
            AccessFailedCount = AccessFailedCount++;
        }
        public void ResetAccessFailedCount()
        {
            AccessFailedCount = 0;
        }

        public void SetPasswordHash(string password)
        {
            PasswordHash = EncryptPassword(password, SecurityStamp, NormalizedEmail);
        }

        public void SetStatus(UserStatus status)
        {
            Status = status;
        }

        public void SetApplication(Guid? applicationId)
        {
            if (applicationId == null || applicationId == Guid.Empty)
            {
                var application = new WebApplication();
                Application = application;
                applicationId = application.Id;
            }
            ApplicationId = applicationId.Value;
        }

        public bool VerifyPassword(string password)
        {
            return PasswordHash == EncryptPassword(password, SecurityStamp, NormalizedEmail);
        }

        private string EncryptPassword(string? password, string securityStamp, string normalizedEmail)
        {
            if (string.IsNullOrWhiteSpace(password)) return string.Empty;

            using (var sha256 = SHA256.Create())
            {
                var combinedBytes = Encoding.UTF8.GetBytes(password + securityStamp + normalizedEmail);
                var hashedBytes = sha256.ComputeHash(combinedBytes);
                var code = Convert.ToBase64String(hashedBytes);

                var combinedCodeBytes = Encoding.UTF8.GetBytes(securityStamp + code);
                var hashedCodeBytes = sha256.ComputeHash(combinedCodeBytes);
                return Convert.ToBase64String(hashedCodeBytes);
            }
        }

        private static string GenerateSecurityStamp()
        {
            const string letters = "abcdefghiklmnopqrstuvwxyz";
            const string numbers = "0123456789";
            const string specialChars = "!@#$%^&*";

            var random = new Random();
            var securityStampLetters = new string(Enumerable.Repeat(letters, 5)
              .Select(s => s[random.Next(s.Length)]).ToArray());
            var securityStampLettersUpper = new string(Enumerable.Repeat(letters.ToUpper(), 5)
              .Select(s => s[random.Next(s.Length)]).ToArray());
            var securityStampNumber = new string(Enumerable.Repeat(numbers, 5)
              .Select(s => s[random.Next(s.Length)]).ToArray());
            var securityStampSpecialChars = new string(Enumerable.Repeat(specialChars, 5)
              .Select(s => s[random.Next(s.Length)]).ToArray());

            return $"{securityStampLetters}{securityStampLettersUpper}{securityStampNumber}{securityStampSpecialChars}";
        }
    }
}
