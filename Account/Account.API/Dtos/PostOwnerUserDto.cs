using System.ComponentModel.DataAnnotations;

namespace Account.API.Dtos
{
    public class PostOwnerUserDto : RequestUserDto
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }
        [Required]
        [MinLength(8)]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$",
            ErrorMessage = "The password must contain at least one uppercase letter, one lowercase letter, and one number.")]
        public required string Password { get; set; }
    }
}
