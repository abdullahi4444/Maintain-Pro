using Maintenance_Request_System_API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Maintenance_Request_System_API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<MaintenanceRequest> MaintenanceRequests { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<ActivityLog> ActivityLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Enum conversions
        modelBuilder.Entity<User>()
            .Property(u => u.Role)
            .HasConversion(new EnumToStringConverter<Role>());

        modelBuilder.Entity<MaintenanceRequest>()
            .Property(m => m.Priority)
            .HasConversion(new EnumToStringConverter<Priority>());

        modelBuilder.Entity<MaintenanceRequest>()
            .Property(m => m.Status)
            .HasConversion(new EnumToStringConverter<Status>());

        // Relationships
        modelBuilder.Entity<MaintenanceRequest>()
            .HasOne(m => m.Requester)
            .WithMany(u => u.RequestsAsRequester)
            .HasForeignKey(m => m.RequesterId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<MaintenanceRequest>()
            .HasOne(m => m.Technician)
            .WithMany(u => u.RequestsAsTechnician)
            .HasForeignKey(m => m.TechnicianId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Request)
            .WithMany(m => m.Comments)
            .HasForeignKey(c => c.RequestId)
            .OnDelete(DeleteBehavior.Cascade);
            
        modelBuilder.Entity<Notification>()
            .HasOne(n => n.User)
            .WithMany()
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ActivityLog>()
            .HasOne(a => a.User)
            .WithMany()
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
