using System.ComponentModel.DataAnnotations;

namespace Account.API.Dtos
{
    public class PutUserDto : RequestUserDto
    {
        [Required]
        public Guid Id { get; set; }
        public Guid? WebApplication { get; set; }
    }
}
