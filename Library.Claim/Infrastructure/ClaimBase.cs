using System.Reflection;

namespace Library.Claim.Infrastructure
{
    public abstract class ClaimBase : IClaim
    {
        public IEnumerable<string> GetClaims()
        {
            var items = GetType()
                       .GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy)
                       .Where(fi => fi.IsLiteral && !fi.IsInitOnly && fi.FieldType == typeof(string))
                       .Select(fi => fi.GetRawConstantValue() as string);
            return items.Where(static x => !string.IsNullOrWhiteSpace(x))!;
        }
    }
}
