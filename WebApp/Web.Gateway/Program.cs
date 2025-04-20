using Library.ServiceDefaults;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddReverseProxy()
   .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
   .AddServiceDiscoveryDestinationResolver();

// Register HttpClient service
builder.Services.AddHttpClient();

var app = builder.Build();

app.UseHttpsRedirection();
app.Use(async (context, next) =>
{
    if (!context.Request.IsHttps)
    {
        var httpsUrl = $"https://{context.Request.Host}{context.Request.Path}{context.Request.QueryString}";
        context.Response.Redirect(httpsUrl);
    }
    else
    {
        await next();
    }
});
app.MapDefaultEndpoints();
app.MapReverseProxy();

// Add Hello page for home page
app.MapGet("/", () => "Hello, World!");

app.MapFallbackToFile("/index.html");

await app.RunAsync();
