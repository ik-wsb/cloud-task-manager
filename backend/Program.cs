using CloudBackend.Models;
using CloudBackend.Repositories;
using CloudBackend.Services;
using Microsoft.EntityFrameworkCore;
using Azure.Identity; 

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsProduction())
{
    var vaultName = builder.Configuration["KeyVaultName"];
    var keyVaultEndpoint = new Uri($"https://{vaultName}.vault.azure.net/");
    
    builder.Configuration.AddAzureKeyVault(keyVaultEndpoint, new DefaultAzureCredential());
}

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Environment.IsProduction() 
        ? builder.Configuration["DbConnectionString"] 
        : builder.Configuration.GetConnectionString("DefaultConnection");

    options.UseSqlServer(connectionString, sqlOptions => sqlOptions.EnableRetryOnFailure());
});

builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<ITaskService, TaskService>();

builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

app.UseCors("AllowAll");
app.UseSwagger();
app.UseSwaggerUI(); 
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); 
}

app.Run();