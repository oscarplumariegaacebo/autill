using Autill.Data;
using Autill.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text.Json;

namespace Autill.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetsController : ControllerBase
    {
        private readonly BudgetContext _budgetContext;
        private readonly ClientContext _clientContext;

        public BudgetsController(BudgetContext budgetContext, ClientContext clientContext)
        {
            _budgetContext = budgetContext;
            _clientContext = clientContext;
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

            var lastNums = lastBudget.Name.Substring(lastBudget.Name.Length - 4);
            int nextNum = int.Parse(lastNums)+1;

            var nextName = "";

            /*TODO -> optimize*/
            if (nextNum.ToString().Length == 1)
            {
                nextName = "-000" + nextNum;
            }else if (nextNum.ToString().Length == 2)
            {
                nextName = "-00" + nextNum;
            }else if (nextNum.ToString().Length == 3)
            {
                nextName = "-0" + nextNum;
            }
            else if (nextNum.ToString().Length == 4)
            {
                nextName = "-" + nextNum;
            }

            var result = new
            {
                name = nextName
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
            budget.CloseIt = false;
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
