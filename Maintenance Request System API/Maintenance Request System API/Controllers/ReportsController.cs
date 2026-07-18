using Maintenance_Request_System_API.Data;
using Maintenance_Request_System_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Maintenance_Request_System_API.Controllers;

[Authorize]
[Route("reports")]
[ApiController]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReportsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("requests")]
    public async Task<IActionResult> GetRequestsReport([FromQuery] string? status, [FromQuery] string? priority)
    {
        var query = _context.MaintenanceRequests.AsQueryable();

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<Status>(status, out var s))
            query = query.Where(r => r.Status == s);

        if (!string.IsNullOrEmpty(priority) && Enum.TryParse<Priority>(priority, out var p))
            query = query.Where(r => r.Priority == p);

        var requests = await query
            .Include(r => r.Requester)
            .Include(r => r.Technician)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
            
        return Ok(requests);
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsersReport()
    {
        var users = await _context.Users
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                u.Role,
                u.IsActive,
                u.CreatedAt
            })
            .ToListAsync();
        return Ok(users);
    }

    [HttpGet("technicians")]
    public async Task<IActionResult> GetTechniciansReport()
    {
        var technicians = await _context.Users
            .Where(u => u.Role == Role.TECHNICIAN)
            .Select(t => new
            {
                t.Id,
                t.FullName,
                t.Email,
                t.IsActive,
                AssignedCount = t.RequestsAsTechnician.Count(),
                CompletedCount = t.RequestsAsTechnician.Count(r => r.Status == Status.COMPLETED)
            })
            .ToListAsync();
        return Ok(technicians);
    }
}
