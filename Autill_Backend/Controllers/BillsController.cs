using Autill.Data;
using Autill.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Autill.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BillsController : ControllerBase
    {

        private readonly BillContext _billContext;
        private readonly BudgetContext _budgetContext;

        public BillsController(BillContext billContext, BudgetContext budgetContext)
        {
            _billContext = billContext;
            _budgetContext = budgetContext; 
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bill>>> GetBills()
        {
            return await _billContext.Bills.ToListAsync();
        }

        [HttpPost("clone")]
        public async Task<ActionResult<Bill>> CloneBudget([FromBody]int budgetId)
        {
            var budgetToClone = await _budgetContext.Budgets.FindAsync(budgetId);

            if (budgetToClone != null)
            {
                budgetToClone.CloseIt = true;
                await _budgetContext.SaveChangesAsync();

                var numBudget = budgetToClone.Name.Substring(budgetToClone.Name.Length - 4);

                var bill = new Bill();
                bill.IdBusiness = budgetToClone.IdBusiness;
                bill.Name = "Factura-"+numBudget;
                bill.Price = budgetToClone.Price;
                bill.IdBudget = budgetToClone.Id;
                bill.DescriptionItems = budgetToClone.DescriptionItems;
                bill.ClientId = budgetToClone.ClientId;
                bill.Date = budgetToClone.Date;

                _billContext.Bills.Add(bill);
                await _billContext.SaveChangesAsync();
                return bill;
            }

            return null;

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBill(int id)
        {
            var bill = await _billContext.Bills.FindAsync(id);
            if (bill == null)
            {
                return NotFound();
            }

            BudgetsController bc = new BudgetsController(_budgetContext, null);

            await bc.RevertStatus(bill.IdBudget);

            //await _bc.RevertStatus(bill.IdBudget);

            _billContext.Bills.Remove(bill);
            await _billContext.SaveChangesAsync();
            return NoContent();
        }
    }
}
