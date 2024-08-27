using Autill.Data;
using Autill.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Autill.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetsController : ControllerBase
    {
        private readonly BudgetContext _budgetContext;

        public BudgetsController(BudgetContext budgetContext)
        {
            _budgetContext = budgetContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Budget>>> GetBudgets()
        {
            return await _budgetContext.Budgets.ToListAsync();
        }

        [HttpGet("nextName")]
        public async Task<ActionResult<string>> LastNameBudget()
        {
            var lastBudget = await _budgetContext.Budgets.OrderBy(e => e.Id).LastOrDefaultAsync();

            if (lastBudget == null)
            {
                var resultNotFound = new
                {
                    name = "-0000"
                };

                return JsonSerializer.Serialize(resultNotFound);
            }

            var result = new
            {
                name = lastBudget.Name
            };
            return JsonSerializer.Serialize(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Budget>> GetBudget(int id)
        {
            var budget = await _budgetContext.Budgets.FindAsync(id);
            if (budget == null)
            {
                return NotFound();
            }
            return budget;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutBudget(int id, Budget budget)
        {
            if (id != budget.Id)
            {
                return BadRequest();
            }
            _budgetContext.Entry(budget).State = EntityState.Modified;
            try
            {
                await _budgetContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BudgetExists(id))
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
        public async Task<ActionResult<Budget>> PostBudget(Budget budget)
        {
            _budgetContext.Budgets.Add(budget);
            await _budgetContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBudget), new { id = budget.Id }, budget);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget(int id)
        {
            var budget = await _budgetContext.Budgets.FindAsync(id);
            if (budget == null)
            {
                return NotFound();
            }
            _budgetContext.Budgets.Remove(budget);
            await _budgetContext.SaveChangesAsync();
            return NoContent();
        }

        private bool BudgetExists(int id)
        {
            return _budgetContext.Budgets.Any(e => e.Id == id);
        }
    }
}
