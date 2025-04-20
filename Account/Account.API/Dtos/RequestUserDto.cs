namespace Account.API.Dtos
{
    public class RequestUserDto
    {
        public string? PhoneNumber { get; set; }
        public string? DisplayName { get; set; }
        public string? Avatar { get; set; }
        public string? ProfileUrl { get; set; }
        public string? Description { get; set; }
        public string? Title { get; set; }
        public string? Address { get; set; }
        public List<Guid>? RoleIds { get; set; }
        public DateTime? BirthDate { get; set; }
    }
}
