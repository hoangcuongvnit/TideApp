using System.Text.Json.Serialization;

namespace Library.Domain
{
    public class ErrorDetails
    {
        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;
        [JsonPropertyName("key")]
        public string Key { get; set; } = string.Empty;
    }
}
