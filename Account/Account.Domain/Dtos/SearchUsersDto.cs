namespace Account.Domain.Dtos
{
    public class SearchUsersDto
    {
        public UserFilterDto? Filter { get; set; }
        public PaginationDto? Pagination { get; set; }
    }
}
