using Account.API.Extensions;
using Account.API.Mappings;
using Account.Application;
using Account.Infrastructure;
using Account.Infrastructure.Helpers;
using Library.ServiceDefaults;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.AddServiceDefaults();

// Add the DbContext to the services using connection string from appsettings
var connectionString = builder.Configuration.GetConnectionString("Postgres");
builder.Services.AddDbContext<AccountDatabaseContext>(options =>
    options.UseNpgsql(connectionString, npgsqlOptions =>
        npgsqlOptions.MigrationsAssembly(typeof(Program).Assembly.GetName().Name)));
builder.Services.InitializerDatabase();

builder.Services.InjectionApplication();
builder.Services.InjectionInfrastructure();
builder.Services.AddAuthorizationPolicy();
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

builder.AddDefaultAuthentication();
builder.AddDefaultOpenApi();
builder.Services.AddControllers();

var app = builder.Build();

// Use the custom middleware
app.UseMiddleware<HandleExceptionMiddleware>();

app.MapDefaultEndpoints();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseDefaultOpenApi();

app.Run();