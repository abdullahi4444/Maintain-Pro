using Maintenance_Request_System_API.Data;
using Maintenance_Request_System_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Maintenance_Request_System_API.Controllers;

[Authorize]
[Route("dashboard")]
[ApiController]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var totalRequests = await _context.MaintenanceRequests.CountAsync();
        var pendingRequests = await _context.MaintenanceRequests.CountAsync(r => r.Status == Status.PENDING);
        var assignedRequests = await _context.MaintenanceRequests.CountAsync(r => r.Status == Status.ASSIGNED);
        var inProgressRequests = await _context.MaintenanceRequests.CountAsync(r => r.Status == Status.IN_PROGRESS);
        var completedRequests = await _context.MaintenanceRequests.CountAsync(r => r.Status == Status.COMPLETED);
        var rejectedRequests = await _context.MaintenanceRequests.CountAsync(r => r.Status == Status.REJECTED);
        
        var totalUsers = await _context.Users.CountAsync();
        var totalTechnicians = await _context.Users.CountAsync(u => u.Role == Role.TECHNICIAN);

        return Ok(new
        {
            totalRequests,
            pendingRequests,
            assignedRequests,
            inProgressRequests,
            completedRequests,
            rejectedRequests,
            totalUsers,
            totalTechnicians
        });
    }

    [HttpGet("recent-requests")]
    public async Task<IActionResult> GetRecentRequests([FromQuery] int limit = 5)
    {
        var requests = await _context.MaintenanceRequests
            .Include(r => r.Requester)
            .OrderByDescending(r => r.CreatedAt)
            .Take(limit)
            .ToListAsync();
        return Ok(requests);
    }

    [HttpGet("monthly-requests")]
    public async Task<IActionResult> GetMonthlyRequests([FromQuery] int? year)
    {
        var targetYear = year ?? DateTime.UtcNow.Year;
        
        var requests = await _context.MaintenanceRequests
            .Where(r => r.CreatedAt.Year == targetYear)
            .GroupBy(r => r.CreatedAt.Month)
            .Select(g => new { month = g.Key, count = g.Count() })
            .ToListAsync();
            
        var monthlyCounts = new int[12];
        foreach (var req in requests)
        {
            monthlyCounts[req.month - 1] = req.count;
        }
            
        return Ok(monthlyCounts);
    }

    [HttpGet("request-status")]
    public async Task<IActionResult> GetRequestStatus()
    {
        var stats = await _context.MaintenanceRequests
            .GroupBy(r => r.Status)
            .Select(g => new { status = g.Key.ToString(), count = g.Count() })
            .ToListAsync();
            
        var dict = stats.ToDictionary(x => x.status, x => x.count);
        return Ok(dict);
    }

    [HttpGet("technician-performance")]
    public async Task<IActionResult> GetTechnicianPerformance()
    {
        var performance = await _context.Users
            .Where(u => u.Role == Role.TECHNICIAN)
            .Select(t => new
            {
                technicianId = t.Id,
                technicianName = t.FullName,
                completedRequests = t.RequestsAsTechnician.Count(r => r.Status == Status.COMPLETED),
                totalAssigned = t.RequestsAsTechnician.Count()
            })
            .ToListAsync();
            
        return Ok(performance);
    }
}
