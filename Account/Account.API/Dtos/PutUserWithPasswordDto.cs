using System.ComponentModel.DataAnnotations;

namespace Account.API.Dtos
{
    public class PutUserWithPasswordDto : PutUserDto
    {
        [Required]
        [MinLength(8)]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$",
            ErrorMessage = "The password must contain at least one uppercase letter, one lowercase letter, and one number.")]
        public string Password { get; set; }
    }
}
