using Blog.API.Extensions;
using Blog.Infrastructure;
using Blog.Infrastructure.Helpers;
using Library.ServiceDefaults;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.AddServiceDefaults();

// Add the DbContext to the services using connection string from appsettings  
var connectionString = builder.Configuration.GetConnectionString("Postgres");
builder.Services.AddDbContext<BlogDatabaseContext>(options =>
   options.UseNpgsql(connectionString, npgsqlOptions =>
       npgsqlOptions.MigrationsAssembly(typeof(Program).Assembly.GetName().Name)));
builder.Services.InitializerDatabase();

// Add services to the container.  
builder.Services.InjectionInfrastructure();
builder.Services.AddAuthorizationPolicy();

builder.AddDefaultAuthentication();
builder.AddDefaultOpenApi();
builder.Services.AddControllers();

var app = builder.Build();
app.UseMiddleware<HandleExceptionMiddleware>();

app.MapDefaultEndpoints();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseDefaultOpenApi();

app.Run();
