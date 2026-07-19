using System.ComponentModel.DataAnnotations;

namespace Maintenance_Request_System_API.Models;

/// <summary>
/// DTO used for user login requests.
/// </summary>
public class LoginDto
{
    /// <summary>The user's registered email address.</summary>
    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "A valid email address is required.")]
    public string Email { get; set; } = string.Empty;

    /// <summary>The user's account password.</summary>
    [Required(ErrorMessage = "Password is required.")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
    public string Password { get; set; } = string.Empty;
}

/// <summary>
/// DTO used when registering a new user account.
/// </summary>
public class RegisterDto
{
    /// <summary>The user's full name.</summary>
    [Required(ErrorMessage = "Full name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Full name must be between 2 and 100 characters.")]
    public string FullName { get; set; } = string.Empty;

    /// <summary>A unique, valid email address for the account.</summary>
    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "A valid email address is required.")]
    public string Email { get; set; } = string.Empty;

    /// <summary>Account password — minimum 6 characters.</summary>
    [Required(ErrorMessage = "Password is required.")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
    public string Password { get; set; } = string.Empty;

    /// <summary>Optional contact phone number.</summary>
    [Phone(ErrorMessage = "A valid phone number is required.")]
    public string? Phone { get; set; }
}

/// <summary>
/// Response body returned after a successful login or registration.
/// </summary>
public class AuthResponseDto
{
    /// <summary>The JWT bearer token to include in subsequent API requests.</summary>
    public string access_token { get; set; } = string.Empty;

    /// <summary>The authenticated user's profile data.</summary>
    public User user { get; set; } = null!;
}
