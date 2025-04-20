using System.ComponentModel.DataAnnotations;

namespace Account.API.Dtos
{
    public class ResetPasswordDto
    {
        [Required]
        [MinLength(20)]
        public required string Token { get; set; }

        [Required]
        [MinLength(8)]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$",
            ErrorMessage = "The password must contain at least one uppercase letter, one lowercase letter, and one number.")]
        public required string Password { get; set; }
    }
}
