using Maintenance_Request_System_API.Models;
using Microsoft.EntityFrameworkCore;

namespace Maintenance_Request_System_API.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        context.Database.EnsureCreated();

        if (context.Users.Any())
        {
            return;   // DB has been seeded
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword("12345678");

        var users = new User[]
        {
            // Admins
            new User
            {
                Id = Guid.NewGuid().ToString(),
                FullName = "Admin One",
                Email = "admin1@example.com",
                Password = passwordHash,
                Role = Role.ADMIN,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = Guid.NewGuid().ToString(),
                FullName = "Admin Two",
                Email = "admin2@example.com",
                Password = passwordHash,
                Role = Role.ADMIN,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Technicians
            new User
            {
                Id = Guid.NewGuid().ToString(),
                FullName = "Technician One",
                Email = "tech1@example.com",
                Password = passwordHash,
                Role = Role.TECHNICIAN,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = Guid.NewGuid().ToString(),
                FullName = "Technician Two",
                Email = "tech2@example.com",
                Password = passwordHash,
                Role = Role.TECHNICIAN,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Requesters
            new User
            {
                Id = Guid.NewGuid().ToString(),
                FullName = "Requester One",
                Email = "requester1@example.com",
                Password = passwordHash,
                Role = Role.REQUESTER,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = Guid.NewGuid().ToString(),
                FullName = "Requester Two",
                Email = "requester2@example.com",
                Password = passwordHash,
                Role = Role.REQUESTER,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Users.AddRange(users);
        context.SaveChanges();
    }
}
