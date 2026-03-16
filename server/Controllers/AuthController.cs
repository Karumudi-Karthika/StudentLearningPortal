using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] AuthRequest request)
    {
        var exists = await _context.Students.AnyAsync(s => s.Email == request.Email);
        if (exists) return Conflict("Email already in use.");

        var student = new Student
        {
            FullName = request.FullName ?? "New Student",
            Email = request.Email,
            PasswordHash = HashPassword(request.Password),
            IsAdmin = false
        };

        _context.Students.Add(student);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Registered successfully.", studentId = student.Id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthRequest request)
    {
        var student = await _context.Students
            .FirstOrDefaultAsync(s => s.Email == request.Email);

        if (student == null || !VerifyPassword(request.Password, student.PasswordHash))
            return Unauthorized("Invalid email or password.");

        var token = GenerateToken(student);
        return Ok(new {
            token,
            studentId = student.Id,
            fullName = student.FullName,
            isAdmin = student.IsAdmin
        });
    }

    private string GenerateToken(Student student)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _config["Jwt:Key"] ?? "supersecretkey1234567890abcdefgh"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, student.Id.ToString()),
            new Claim(ClaimTypes.Email, student.Email),
            new Claim(ClaimTypes.Role, student.IsAdmin ? "Admin" : "Student")
        };

        var token = new JwtSecurityToken(
            issuer: "StudentPortal",
            audience: "StudentPortal",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }

    private bool VerifyPassword(string password, string hash)
    {
        return HashPassword(password) == hash;
    }
}

public class AuthRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
