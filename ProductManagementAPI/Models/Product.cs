using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProductManagementAPI.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")] // Ensure MySQL compatibility
        public decimal Price { get; set; }

        public string? Image { get; set; }

        [ForeignKey("User")]
        [Column("created_by")] // Match MySQL column name
        public int CreatedBy { get; set; }
        public User? User { get; set; }
    }
}
