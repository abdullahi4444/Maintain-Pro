namespace Maintenance_Request_System_API.Models;

public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Phone { get; set; }
}

public class AuthResponseDto
{
    public string access_token { get; set; } = string.Empty;
    public User user { get; set; } = null!;
}
