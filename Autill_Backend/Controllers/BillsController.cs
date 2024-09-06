using Autill.Data;
using Autill.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Autill.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BillsController
    {

        private readonly BillContext _billContext;

        public BillsController(BillContext billContext)
        {
            _billContext = billContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bill>>> GetBills()
        {
            return await _billContext.Bills.ToListAsync();
        }

        [HttpGet("clone/{id}")]
        public async Task<ActionResult<IEnumerable<Bill>>> CloneBudget(int budgetId)
        {
            var columnName = "Id";
            var columnValue = new SqlParameter("columnValue", budgetId);

            string sql = $"INSERT INTO Bills (IdBusiness, Name, ClientId, Date, DescriptionItems, Price) SELECT IdBusiness, Name, ClientId, Date, DescriptionItems, Price FROM Budgets WHERE {columnName} = @columnValue";
            return await _billContext.Bills.FromSqlRaw(sql, columnValue).ToListAsync();
        }
    }
}
