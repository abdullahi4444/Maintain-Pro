using Maintenance_Request_System_API.Data;
using Maintenance_Request_System_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Maintenance_Request_System_API.Controllers;

[Authorize]
[Route("comments")]
[ApiController]
public class CommentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CommentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("request/{requestId}")]
    public async Task<IActionResult> Create(string requestId, [FromBody] Comment data)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        data.RequestId = requestId;
        data.UserId = userId!;
        data.CreatedAt = DateTime.UtcNow;

        _context.Comments.Add(data);
        await _context.SaveChangesAsync();

        var commentWithUser = await _context.Comments
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == data.Id);

        // Get request to find other participants
        var request = await _context.MaintenanceRequests.FindAsync(requestId);
        if (request != null)
        {
            // Collect user IDs to notify (requester, technician, admins)
            var userIdsToNotify = new HashSet<string>();
            userIdsToNotify.Add(request.RequesterId);
            if (!string.IsNullOrEmpty(request.TechnicianId))
                userIdsToNotify.Add(request.TechnicianId);

            var admins = await _context.Users.Where(u => u.Role == Role.ADMIN).ToListAsync();
            foreach (var admin in admins)
                userIdsToNotify.Add(admin.Id);

            // Remove current user from notifications (they don't need to see their own comment)
            userIdsToNotify.Remove(userId!);

            // Create notifications
            foreach (var uid in userIdsToNotify)
            {
                _context.Notifications.Add(new Notification
                {
                    UserId = uid,
                    Title = "New Comment",
                    Message = $"{commentWithUser?.User?.FullName} commented on request \"{request.Title}\".",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                });
            }
            await _context.SaveChangesAsync();
        }

        return CreatedAtAction(nameof(GetByRequestId), new { requestId = requestId }, commentWithUser);
    }

    [HttpGet("request/{requestId}")]
    public async Task<IActionResult> GetByRequestId(string requestId)
    {
        var comments = await _context.Comments
            .Include(c => c.User)
            .Where(c => c.RequestId == requestId)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync();
        return Ok(comments);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment == null) return NotFound();

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        if (comment.UserId != userId && userRole != Role.ADMIN.ToString())
        {
            return Forbid();
        }

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
