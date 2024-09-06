using Autill.Models;
using Microsoft.EntityFrameworkCore;

namespace Autill.Data
{
    public class BillContext : DbContext
    {
        public DbSet<Bill> Bills { get; set; }
        public BillContext(DbContextOptions<BillContext> options) : base(options) { }
    }
}
