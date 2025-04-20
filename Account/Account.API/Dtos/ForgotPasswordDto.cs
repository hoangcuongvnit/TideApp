using System.ComponentModel.DataAnnotations;

namespace Account.API.Dtos
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }
    }
}
