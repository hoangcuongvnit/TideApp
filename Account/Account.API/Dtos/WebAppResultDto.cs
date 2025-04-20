namespace Account.API.Dtos
{
    public class WebAppResultDto
    {
        public WebAppResultDto(Guid id, string name, string code, string? description)
        {
            Id = id;
            Name = name;
            Code = code;
            Description = description;
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string? Description { get; set; }
    }
}
