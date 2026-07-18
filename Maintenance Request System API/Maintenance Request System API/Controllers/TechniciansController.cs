using Maintenance_Request_System_API.Data;
using Maintenance_Request_System_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Maintenance_Request_System_API.Controllers;

[Authorize]
[Route("technicians")]
[ApiController]
public class TechniciansController : ControllerBase
{
    private readonly AppDbContext _context;

    public TechniciansController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var technicians = await _context.Users.Where(u => u.Role == Role.TECHNICIAN).ToListAsync();
        return Ok(technicians);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOne(string id)
    {
        var technician = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && u.Role == Role.TECHNICIAN);
        if (technician == null) return NotFound();
        return Ok(technician);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] User data)
    {
        data.Role = Role.TECHNICIAN;
        if (!string.IsNullOrEmpty(data.Password))
        {
            data.Password = BCrypt.Net.BCrypt.HashPassword(data.Password);
        }
        else
        {
            data.Password = BCrypt.Net.BCrypt.HashPassword("technician123");
        }

        _context.Users.Add(data);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetOne), new { id = data.Id }, data);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] User data)
    {
        var technician = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && u.Role == Role.TECHNICIAN);
        if (technician == null) return NotFound();

        if (!string.IsNullOrEmpty(data.FullName)) technician.FullName = data.FullName;
        if (!string.IsNullOrEmpty(data.Phone)) technician.Phone = data.Phone;
        if (!string.IsNullOrEmpty(data.Email)) technician.Email = data.Email;
        technician.IsActive = data.IsActive;

        if (!string.IsNullOrEmpty(data.Password))
        {
            technician.Password = BCrypt.Net.BCrypt.HashPassword(data.Password);
        }

        technician.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(technician);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var technician = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && u.Role == Role.TECHNICIAN);
        if (technician == null) return NotFound();

        _context.Users.Remove(technician);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
