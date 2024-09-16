using Autill.Models;
using Microsoft.EntityFrameworkCore;

namespace Autill.Data
{
    public class ItemContext : DbContext
    {
        public DbSet<Item> Items { get; set; }
        public ItemContext(DbContextOptions<ItemContext> options) : base(options) { }
    }
}
