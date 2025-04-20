namespace Account.API.Dtos
{
    public class RoleResultDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string LocaleKey { get; set; }
        public string? Description { get; set; }
        public int Order { get; set; } = 0;
    }
}
