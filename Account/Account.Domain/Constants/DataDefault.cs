namespace Account.Domain.Constants
{
    public class DataDefault
    {
        public class RoleDefault
        {
            public const string Administrator = "Administrator";
            public const string Owner = "Owner";
            public const string Author = "Author";
            public const string Customer = "Customer";
            public const string Guest = "Guest";
        }

        public class Providers
        {
            public const string Local = "Local";
            public const string Google = "Google";
            public const string Facebook = "Facebook";
            public const string Twitter = "Twitter";
            public const string Microsoft = "Microsoft";
        }

        public class TokenNames
        {
            public const string VerifyEmail = "VerifyEmail";
            public const string ForgotPassword = "ForgotPassword";
            public const string VerifyPhoneNumber = "VerifyPhoneNumber";
            public const string SignIn = "SignIn";
        }
    }
}
