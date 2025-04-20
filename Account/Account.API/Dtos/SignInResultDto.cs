using System.ComponentModel.DataAnnotations;

namespace Account.API.Dtos
{
    public class SignInResultDto
    {
        [Required]
        public string Token { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
    }
}
