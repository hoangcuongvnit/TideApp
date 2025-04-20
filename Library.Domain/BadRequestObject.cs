using System.Text.Json;
using System.Text.Json.Serialization;

namespace Library.Domain
{
    public class BadRequestObject
    {
        private readonly string _propertyNameDefault = "general";
        public BadRequestObject()
        {
        }
        public void Add(string key, string message)
        {
            if (!Errors.ContainsKey(_propertyNameDefault))
            {
                Errors.Add(_propertyNameDefault, new List<ErrorDetails>());
            }

            Errors[_propertyNameDefault].Add(new ErrorDetails { Key = key, Message = message });
        }

        public void Add(string propertyName, string key, string message)
        {
            if (!Errors.ContainsKey(propertyName))
            {
                Errors.Add(propertyName, new List<ErrorDetails>());
            }

            Errors[propertyName].Add(new ErrorDetails { Key = key, Message = message });
        }

        public override string ToString()
        {
            return JsonSerializer.Serialize(GetErrorsObject());
        }

        private object GetErrorsObject()
        {
            return new { errors = Errors };
        }

        [JsonPropertyName("errors")]
        public Dictionary<string, List<ErrorDetails>> Errors { get; private set; } = new Dictionary<string, List<ErrorDetails>>();
    }
}
