using Maintenance_Request_System_API.Data;
using Maintenance_Request_System_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Maintenance_Request_System_API.Controllers;

[Authorize]
[Route("users")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOne(string id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] User data)
    {
        if (!string.IsNullOrEmpty(data.Password))
        {
            data.Password = BCrypt.Net.BCrypt.HashPassword(data.Password);
        }
        else
        {
            data.Password = BCrypt.Net.BCrypt.HashPassword("defaultpassword123");
        }
        
        _context.Users.Add(data);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetOne), new { id = data.Id }, data);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] User data)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        if (!string.IsNullOrEmpty(data.FullName)) user.FullName = data.FullName;
        if (!string.IsNullOrEmpty(data.Phone)) user.Phone = data.Phone;
        if (!string.IsNullOrEmpty(data.Email)) user.Email = data.Email;
        if (data.Role != default) user.Role = data.Role;
        user.IsActive = data.IsActive;
        
        if (!string.IsNullOrEmpty(data.Password))
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(data.Password);
        }

        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(user);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] User data)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        if (!string.IsNullOrEmpty(data.FullName)) user.FullName = data.FullName;
        if (!string.IsNullOrEmpty(data.Phone)) user.Phone = data.Phone;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(user);
    }

    [HttpPatch("avatar")]
    public async Task<IActionResult> UpdateAvatar(IFormFile file)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        if (file != null && file.Length > 0)
        {
            var uploads = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            Directory.CreateDirectory(uploads);
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploads, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            user.Avatar = "/uploads/" + fileName;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        return Ok(user);
    }
}
