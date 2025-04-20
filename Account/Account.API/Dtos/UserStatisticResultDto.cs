public class UserStatisticResultDto
{
    public UserStatisticResultDto()
    {
    }

    public UserStatisticResultDto(int total, int totalActive, int totalInactive, int totalAwaiting, int totalDeleted, int totalWebAppActive)
    {
        Total = total;
        TotalActive = totalActive;
        TotalInactive = totalInactive;
        TotalAwaiting = totalAwaiting;
        TotalDeleted = totalDeleted;
        TotalWebAppActive = totalWebAppActive;
    }

    public int Total { get; set; }
    public int TotalActive { get; set; }
    public int TotalInactive { get; set; }
    public int TotalAwaiting { get; set; }
    public int TotalDeleted { get; set; }
    public int TotalWebAppActive { get; set; }
}
