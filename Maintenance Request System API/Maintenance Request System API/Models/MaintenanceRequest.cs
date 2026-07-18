using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Maintenance_Request_System_API.Models;

[Table("maintenance_requests")]
public class MaintenanceRequest
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public Priority Priority { get; set; } = Priority.LOW;
    public Status Status { get; set; } = Status.PENDING;
    public string? Image { get; set; }
    
    public string RequesterId { get; set; } = string.Empty;
    public User? Requester { get; set; }

    public string? TechnicianId { get; set; }
    public User? Technician { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string? RepairNotes { get; set; }
    public string? CompletionImage { get; set; }

    [JsonIgnore]
    public List<Comment> Comments { get; set; } = new();
}
