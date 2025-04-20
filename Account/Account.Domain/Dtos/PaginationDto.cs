namespace Account.Domain.Dtos
{
    public class PaginationDto
    {
        public string SortBy { get; set; } = "CreatedAt";
        public bool IsDescending { get; set; } = false;
        public int Size { get; set; } = 20;
        public int Page { get; set; } = 0;
    }
}
