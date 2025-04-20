using Library.Domain;

namespace Account.Domain.Dtos
{
    public class UserStatisticDto
    {
        public UserStatisticDto(Guid id, UserStatus userStatus, Guid? webApp)
        {
            Id = id;
            Status = userStatus;
            WebApplicationId = webApp;
        }

        public Guid Id { get; set; }
        public UserStatus Status { get; set; }
        public Guid? WebApplicationId { get; set; }
    }
}
