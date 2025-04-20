namespace Account.API.Constants
{
    public class ResponsesMessages
    {
        public const string AC_Email_Exist = "Email already exists.";

        public const string AC_Account_Ready = "Account is ready to sign in.";
        public const string AC_Account_NotExist = "Account does not exist.";
        public const string AC_Account_Deleted = "Account has been deleted.";
        public const string AC_Verification_Invalid = "Invalid verification code.";
        public const string AC_Verification_Expired = "Verification code has expired.";
        public const string AC_Verification_Success = "Verification successful.";
        public const string AC_Verification_Error = "Error occurred while verifying";

        public const string AC_Password_NotMatch = "Password does not match.";

        public const string AC_PhoneNumber_Invalid = "Invalid phone number format.";

        public const string AC_BirthDate_Invalid = "Invalid Date format.";

        public const string AC_SignUp_Success = "Sign up successful.";
        public const string AC_SignUp_Error = "Error occurred while signing up.";

        public const string AC_SignIn_Invalid = "Invalid email or password.";
        public const string AC_SignIn_Success = "SignIn successful.";
        public const string AC_SignIn_AwaitingVerification = "Account pending verification.";
        public const string AC_SignIn_PendingApproval = "Account pending approval.";
        public const string AC_SignIn_NotReady = "Account not ready for use. Please contact Admin for assistance.";
        public const string AC_SignIn_Error = "Error occurred while signing in.";

        public const string AC_ForgotPassword_Success = "We have sent a link recovery instruction to your email.";

        public const string AC_InvalidAuthentication = "Lacks valid authentication credentials for the target resource.";
        public const string AC_RequestSuccessfully = "Your request has been processed successfully.";
        public const string AC_RequestFailed = "Your request could not be processed.";

        public const string AC_SaveError = "Error occurred while saving data.";
        public const string AC_InternalServerError = "Internal server error.";
    }
}
