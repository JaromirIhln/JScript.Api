using Microsoft.EntityFrameworkCore;

namespace JScript.Api.Models
{
    public class SomethingContext : DbContext
    {
        public SomethingContext(DbContextOptions<SomethingContext> options)
            : base(options)
        {
        }
        public DbSet<SomethingItem> SomethingItems { get; set; } = null!;
    }
   
}
