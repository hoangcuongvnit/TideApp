using Library.Infrastructure.Interfaces;
using System.Text.Encodings.Web;

namespace Account.API.Extensions
{
    public static class EmailSenderExtensions
    {
        public static void SendEmailConfirmationAsync(this IEmailSender emailSender, string email, string link, string? title = null)
        {
            emailSender.SendEmailAsync(email, title ?? "Confirm your email",
                $"Please confirm your account by clicking this link: <a href='{HtmlEncoder.Default.Encode(link)}'>link</a>");
        }
    }
}
