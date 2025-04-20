using System.ComponentModel.DataAnnotations;

namespace Account.API.Dtos
{
    public class ChangePasswordDto
    {
        [Required]
        public required string CurrentPassword { get; set; }

        [Required]
        [MinLength(8)]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$",
            ErrorMessage = "The password must contain at least one uppercase letter, one lowercase letter, and one number.")]
        public required string NewPassword { get; set; }
    }
}
