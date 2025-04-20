using Library.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Net;

public class HandleExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<HandleExceptionMiddleware> _logger;

    public HandleExceptionMiddleware(RequestDelegate next, ILogger<HandleExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError($"ModifyIResultMiddlewareException: {ex}");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
        var badRequestObject = new BadRequestObject();
        badRequestObject.Add("InternalServerError", "500 Internal server error.");
        return context.Response.WriteAsync(badRequestObject.ToString());
    }
}