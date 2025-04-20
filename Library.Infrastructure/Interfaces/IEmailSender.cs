namespace Library.Infrastructure.Interfaces
{
    public interface IEmailSender
    {
        /// <summary>
        /// Send Email Asynchronously
        /// </summary>
        /// <param name="email"></param>
        /// <param name="subject"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        void SendEmailAsync(string email, string subject, string message);
    }
}
