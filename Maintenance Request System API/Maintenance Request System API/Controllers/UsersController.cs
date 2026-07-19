using Maintenance_Request_System_API.Data;
using Maintenance_Request_System_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Maintenance_Request_System_API.Controllers;

/// <summary>
/// Manages user accounts. Most write operations are restricted to the ADMIN role.
/// </summary>
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

    /// <summary>Returns all users. Admin only.</summary>
    /// <returns>List of all user accounts.</returns>
    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(IEnumerable<User>), 200)]
    [ProducesResponseType(401)]
    [ProducesResponseType(403)]
    public async Task<IActionResult> GetAll()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }

    /// <summary>Returns a single user by their ID.</summary>
    /// <param name="id">The user's GUID string ID.</param>
    [HttpGet("{id}")]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(User), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetOne(string id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound(new { message = "User not found." });
        return Ok(user);
    }

    /// <summary>Creates a new user account. Admin only.</summary>
    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(User), 201)]
    [ProducesResponseType(400)]
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

    /// <summary>Updates an existing user account. Admin only.</summary>
    /// <param name="id">The user's GUID string ID.</param>
    [HttpPatch("{id}")]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(typeof(User), 200)]
    [ProducesResponseType(404)]
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

    /// <summary>Permanently deletes a user account. Admin only.</summary>
    /// <param name="id">The user's GUID string ID.</param>
    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Delete(string id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound(new { message = "User not found." });

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>Allows the currently authenticated user to update their own profile (name, phone).</summary>
    [HttpPatch("profile")]
    [ProducesResponseType(typeof(User), 200)]
    [ProducesResponseType(404)]
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

    /// <summary>Uploads and sets the avatar image for the currently authenticated user.</summary>
    [HttpPatch("avatar")]
    [ProducesResponseType(typeof(User), 200)]
    [ProducesResponseType(404)]
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
