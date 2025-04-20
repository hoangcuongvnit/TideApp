namespace Library.Domain
{
    public class ApiResults<T>
    {
        public T? Results { get; set; }
        public ApiResultMessage? Messages { get; set; }
    }

    public class ApiResultMessage
    {
        public ApiResultMessage(string key)
        {
            Key = key;
        }

        public ApiResultMessage(string key, string message)
        {
            Message = message;
            Key = key;
        }

        public string? Message { get; private set; }
        public string? Key { get; private set; }
    }
}