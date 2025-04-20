namespace Account.API.Dtos
{
    public class UserPaginationResultDto
    {
        public UserPaginationResultDto(int totalRecords, List<UserResultDto>? users, List<RoleResultDto>? roles)
        {
            TotalRecords = totalRecords;
            Users = users ?? new List<UserResultDto>();
            Roles = roles ?? new List<RoleResultDto>();
        }

        public int TotalRecords { get; private set; }
        public List<UserResultDto> Users { get; private set; }
        public List<RoleResultDto> Roles { get; set; }
    }
}
