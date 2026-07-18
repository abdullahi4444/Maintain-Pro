using Maintenance_Request_System_API.Data;
using Maintenance_Request_System_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Maintenance_Request_System_API.Controllers;

[Authorize]
[Route("requests")]
[ApiController]
public class RequestsController : ControllerBase
{
    private readonly AppDbContext _context;

    public RequestsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] IFormCollection formData, IFormFile? image)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        var request = new MaintenanceRequest
        {
            Title = formData["title"].ToString(),
            Description = formData["description"].ToString(),
            Category = formData["category"].ToString(),
            Location = formData["location"].ToString(),
            Priority = Enum.Parse<Priority>(formData["priority"].ToString()),
            RequesterId = userId!
        };

        if (image != null && image.Length > 0)
        {
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            Directory.CreateDirectory(uploads);
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine(uploads, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }
            request.Image = "/uploads/" + fileName;
        }

        _context.MaintenanceRequests.Add(request);
        await _context.SaveChangesAsync();

        // Notify all admins about new request
        var admins = await _context.Users.Where(u => u.Role == Role.ADMIN).ToListAsync();
        foreach (var admin in admins)
        {
            _context.Notifications.Add(new Notification
            {
                UserId = admin.Id,
                Title = "New Maintenance Request",
                Message = $"A new request \"{request.Title}\" has been submitted.",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            });
        }

        // Add activity log
        _context.ActivityLogs.Add(new ActivityLog
        {
            UserId = userId ?? string.Empty,
            Action = "Created Request",
            Description = $"Created maintenance request: {request.Title}",
            CreatedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOne), new { id = request.Id }, request);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int limit = 10, [FromQuery] string? status = null, [FromQuery] string? search = null)
    {
        var query = _context.MaintenanceRequests
            .Include(r => r.Requester)
            .Include(r => r.Technician)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            if (Enum.TryParse<Status>(status, out var parsedStatus))
                query = query.Where(r => r.Status == parsedStatus);
        }

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(r => r.Title.Contains(search) || r.Description.Contains(search) || r.Location.Contains(search));
        }

        var total = await query.CountAsync();
        var requests = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        return Ok(new { data = requests, meta = new { total, page, limit } });
    }

    [HttpGet("my-requests")]
    public async Task<IActionResult> GetMyRequests([FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var query = _context.MaintenanceRequests
            .Include(r => r.Technician)
            .Where(r => r.RequesterId == userId);
            
        var total = await query.CountAsync();
        var requests = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();
            
        return Ok(new { data = requests, meta = new { total, page, limit } });
    }

    [HttpGet("assigned")]
    public async Task<IActionResult> GetAssignedRequests([FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var query = _context.MaintenanceRequests
            .Include(r => r.Requester)
            .Where(r => r.TechnicianId == userId);
            
        var total = await query.CountAsync();
        var requests = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();
            
        return Ok(new { data = requests, meta = new { total, page, limit } });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOne(string id)
    {
        var request = await _context.MaintenanceRequests
            .Include(r => r.Requester)
            .Include(r => r.Technician)
            .FirstOrDefaultAsync(r => r.Id == id);
            
        if (request == null) return NotFound();
        return Ok(request);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] MaintenanceRequest data)
    {
        var request = await _context.MaintenanceRequests.FindAsync(id);
        if (request == null) return NotFound();

        if (!string.IsNullOrEmpty(data.Title)) request.Title = data.Title;
        if (!string.IsNullOrEmpty(data.Description)) request.Description = data.Description;
        if (!string.IsNullOrEmpty(data.Category)) request.Category = data.Category;
        if (!string.IsNullOrEmpty(data.Location)) request.Location = data.Location;
        if (data.Priority != default) request.Priority = data.Priority;

        request.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return Ok(request);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var request = await _context.MaintenanceRequests.FindAsync(id);
        if (request == null) return NotFound();

        _context.MaintenanceRequests.Remove(request);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/assign")]
    public async Task<IActionResult> Assign(string id, [FromBody] AssignDto data)
    {
        var request = await _context.MaintenanceRequests.FindAsync(id);
        if (request == null) return NotFound();

        request.TechnicianId = data.TechnicianId;
        request.Status = Status.ASSIGNED;
        request.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Notify technician
        _context.Notifications.Add(new Notification
        {
            UserId = data.TechnicianId,
            Title = "Request Assigned",
            Message = $"You've been assigned to request \"{request.Title}\".",
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        });

        // Notify requester
        _context.Notifications.Add(new Notification
        {
            UserId = request.RequesterId,
            Title = "Request Assigned",
            Message = $"Your request \"{request.Title}\" has been assigned to a technician.",
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        });

        // Add activity log
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        _context.ActivityLogs.Add(new ActivityLog
        {
            UserId = userId,
            Action = "Assigned Technician",
            Description = $"Assigned technician to request \"{request.Title}\"",
            CreatedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        return Ok(request);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromForm] IFormCollection formData, IFormFile? completionImage)
    {
        var request = await _context.MaintenanceRequests.FindAsync(id);
        if (request == null) return NotFound();

        var oldStatus = request.Status;
        if (formData.TryGetValue("status", out var statusValue))
            request.Status = Enum.Parse<Status>(statusValue.ToString());
            
        if (formData.TryGetValue("repairNotes", out var notesValue))
            request.RepairNotes = notesValue.ToString();

        if (completionImage != null && completionImage.Length > 0)
        {
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            Directory.CreateDirectory(uploads);
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(completionImage.FileName);
            var filePath = Path.Combine(uploads, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await completionImage.CopyToAsync(stream);
            }
            request.CompletionImage = "/uploads/" + fileName;
        }

        request.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Notify requester if status changed
        if (oldStatus != request.Status)
        {
            _context.Notifications.Add(new Notification
            {
                UserId = request.RequesterId,
                Title = $"Request {request.Status}",
                Message = $"Your request \"{request.Title}\" has been marked as {request.Status}.",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            });

            // Notify admin if status changed (optional, for admin visibility)
            var admins = await _context.Users.Where(u => u.Role == Role.ADMIN).ToListAsync();
            foreach (var admin in admins)
            {
                _context.Notifications.Add(new Notification
                {
                    UserId = admin.Id,
                    Title = $"Request Status Changed",
                    Message = $"Request \"{request.Title}\" has been marked as {request.Status}.",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                });
            }
            await _context.SaveChangesAsync();
        }

        return Ok(request);
    }
}

public class AssignDto
{
    public string TechnicianId { get; set; } = string.Empty;
}
