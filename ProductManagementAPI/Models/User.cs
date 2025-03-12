using System.ComponentModel.DataAnnotations;

namespace ProductManagementAPI.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; } // Hashed Password

        [Required]
        public string Role { get; set; } // "admin" or "user"
    }
}
