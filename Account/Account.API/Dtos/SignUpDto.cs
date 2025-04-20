using System.ComponentModel.DataAnnotations;

namespace Account.API.Dtos
{
    public class SignUpDto
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [MinLength(8)]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$",
            ErrorMessage = "The password must contain at least one uppercase letter, one lowercase letter, and one number.")]
        public required string Password { get; set; }

        public string? DisplayName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public DateTime? BirthDate { get; }
    }
}
