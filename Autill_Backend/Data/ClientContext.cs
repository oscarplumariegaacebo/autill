using Autill.Models;
using Microsoft.EntityFrameworkCore;

namespace Autill.Data
{
    public class ClientContext : DbContext
    {
        public DbSet<Client> Clients { get; set; }
        public ClientContext(DbContextOptions<ClientContext> options) : base(options) { }
    }
}
