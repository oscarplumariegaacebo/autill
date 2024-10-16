using Autill.Data;
using Autill.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Autill.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly ItemContext _itemContext;

        public ItemController(ItemContext itemContext)
        {
            _itemContext = itemContext;
        }

        [HttpGet("list/{id}")]
        public async Task<ActionResult<IEnumerable<Item>>> GetItems(string id)
        {
            return await _itemContext.Items.FromSqlInterpolated($"SELECT * FROM items where IdBusiness = {id}").ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> GetItem(int id)
        {
            var item = await _itemContext.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return item;
        }

        [HttpPost]
        public async Task<ActionResult<Item>> PostItem([FromBody] Item item)
        {
            _itemContext.Items.Add(item);
            await _itemContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetItem), new { id = item.Id }, item);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _itemContext.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            _itemContext.Items.Remove(item);
            await _itemContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutItem(int id, Item item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }
            _itemContext.Entry(item).State = EntityState.Modified;
            try
            {
                await _itemContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemExist(id))
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

        private bool ItemExist(int id)
        {
            return _itemContext.Items.Any(e => e.Id == id);
        }
    }
}
