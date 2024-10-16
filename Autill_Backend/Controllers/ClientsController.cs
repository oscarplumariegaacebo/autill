using Autill.Data;
using Autill.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Autill.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly ClientContext _clientContext;
        private readonly BudgetContext _budgetContext;

        public ClientsController(ClientContext clientContext, BudgetContext budgetContext)
        {
            _clientContext = clientContext;
            _budgetContext = budgetContext;
        }

        [HttpGet("list/{id}")]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients(string id)
        {
            return await _clientContext.Clients.FromSqlInterpolated($"SELECT * FROM clients where IdBusiness = {id}").ToListAsync();

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Client>> GetClient(int id)
        {
            var client = await _clientContext.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }
            return client;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutClient(int id, Client client)
        {
            if (id != client.Id)
            {
                return BadRequest();
            }
            _clientContext.Entry(client).State = EntityState.Modified;
            try
            {
                await _clientContext.SaveChangesAsync();
                var budgetsWithClient = _budgetContext.Budgets.Where(x => x.ClientId == id);
                foreach (var budget in budgetsWithClient)
                {
                    budget.ClientName = client.Name;
                }
                await _budgetContext.SaveChangesAsync();

            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Client>> PostClient(Client client)
        {
            _clientContext.Clients.Add(client);
            await _clientContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetClient), new { id = client.Id }, client);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            var client = await _clientContext.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }
            _clientContext.Clients.Remove(client);
            await _clientContext.SaveChangesAsync();
            return NoContent();
        }

        private bool ClientExists(int id)
        {
            return _clientContext.Clients.Any(e => e.Id == id);
        }
    }
}
