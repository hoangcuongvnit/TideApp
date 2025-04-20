namespace Library.Infrastructure.Interfaces
{
    public interface IEntityAction
    {
        public Guid Id { get; set; }
        public EntityAction ActionType { get; set; }
    }
}
