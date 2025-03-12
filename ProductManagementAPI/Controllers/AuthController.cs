using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProductManagementAPI.Data;
using ProductManagementAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProductManagementAPI.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // 🔹 REGISTER USER OR ADMIN
        [HttpPost("register")]
public async Task<IActionResult> Register([FromBody] User user)
{
    try
    {
        if (await _context.Users.AnyAsync(u => u.Email == user.Email))
        {
            return BadRequest(new { message = "Email already exists!" });
        }

        // 🔹 Ensure Password is Hashed Before Saving to Database
        user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User registered successfully!" });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "Internal server error", error = ex.Message });
    }
}


        // 🔹 LOGIN USER OR ADMIN
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginUser)
        {
            try
            {
                // Find the user by email
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginUser.Email);

                // 🔹 Debugging: Log stored password for verification
                Console.WriteLine($"Stored Password Hash: {user?.Password}");
                Console.WriteLine($"Entered Password: {loginUser.Password}");

                // Check if the user exists and if the password is correct
                if (user == null || !BCrypt.Net.BCrypt.Verify(loginUser.Password, user.Password))
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                // Generate a JWT token for the authenticated user
                var token = GenerateJwtToken(user);

                // Return token along with user details
                return Ok(new { token, id = user.Id, name = user.Name, role = user.Role });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // 🔹 GENERATE JWT TOKEN
        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Secret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    // 🔹 CREATE A NEW DTO FOR LOGIN REQUEST
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
