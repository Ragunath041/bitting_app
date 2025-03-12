using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductManagementAPI.Data;
using ProductManagementAPI.Models;
using System.Security.Claims;

namespace ProductManagementAPI.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        // 🔹 1️⃣ ADD PRODUCT (Admin Only)
        [Authorize(Roles = "admin")]
        [HttpPost("add")]
        public async Task<IActionResult> AddProduct([FromBody] Product product)
        {
            try
            {
                // Retrieve the admin ID from the JWT token
                var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (adminId == null)
                {
                    return Unauthorized(new { message = "Invalid admin token. Admin ID not found in the token." });
                }

                // Assign the admin ID to the product (createdBy field)
                product.CreatedBy = int.Parse(adminId);

                // Add the product to the database
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                // Return success response
                return Ok(new { message = "Product added successfully!", productId = product.Id });
            }
            catch (Exception ex)
            {
                // Log the error and return a 500 Internal Server Error response
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // 🔹 2️⃣ GET ALL PRODUCTS (For Users)
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            try
            {
                // Retrieve all products from the database
                var products = await _context.Products.ToListAsync();

                // Return the list of products
                return Ok(products);
            }
            catch (Exception ex)
            {
                // Log the error and return a 500 Internal Server Error response
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // 🔹 3️⃣ GET PRODUCT BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            try
            {
                // Find the product by ID
                var product = await _context.Products.FindAsync(id);

                // If the product is not found, return a 404 Not Found response
                if (product == null)
                {
                    return NotFound(new { message = "Product not found" });
                }

                // Return the product details
                return Ok(product);
            }
            catch (Exception ex)
            {
                // Log the error and return a 500 Internal Server Error response
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
}