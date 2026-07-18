using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Maintenance_Request_System_API.Models;

[Table("users")]
public class User
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    [JsonIgnore]
    public string Password { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public Role Role { get; set; } = Role.REQUESTER;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public List<MaintenanceRequest> RequestsAsRequester { get; set; } = new();
    [JsonIgnore]
    public List<MaintenanceRequest> RequestsAsTechnician { get; set; } = new();
}
