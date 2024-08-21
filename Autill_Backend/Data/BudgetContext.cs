using Autill.Models;
using Microsoft.EntityFrameworkCore;

namespace Autill.Data
{
    public class BudgetContext : DbContext
    {
        public DbSet<Budget> Budgets { get; set; }
        public BudgetContext(DbContextOptions<BudgetContext> options) : base(options) { }
    }
}
