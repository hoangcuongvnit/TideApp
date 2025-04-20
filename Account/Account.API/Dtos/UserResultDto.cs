namespace Account.API.Dtos
{
    public class UserResultDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public UserStatus Status { get; set; }
        public bool IsEmailVerified { get; set; }
        public string Avatar { get; set; } = string.Empty;
        public string ProfileUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public WebAppResultDto? Application { get; set; }
        public List<Guid>? RoleIds { get; set; }
        public List<string>? RoleClaims { get; set; }
        public List<string>? UserClaims { get; set; }
        public DateTime? BirthDate { get; set; }
        public DateTimeOffset? CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
    }
}
