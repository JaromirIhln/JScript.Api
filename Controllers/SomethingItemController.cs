using JScript.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JScript.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SomethingItemsController : ControllerBase
    {
        private readonly SomethingContext _context;

        public SomethingItemsController(SomethingContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SomethingItem>>> GetSomethingItems()
        {
            return await _context.SomethingItems.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<SomethingItem>> PostSomethingItem(SomethingItem item)
        {
            _context.SomethingItems.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSomethingItems), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSomethingItem(int id, SomethingItem item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }

            var existingItem = await _context.SomethingItems.FindAsync(id);
            if (existingItem == null)
            {
                return NotFound();
            }

            existingItem.Name = item.Name;
            existingItem.IsComplete = item.IsComplete;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSomethingItem(int id)
        {
            var item = await _context.SomethingItems.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.SomethingItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("json")]
        public IActionResult GetJson()
        {
            var items = _context.SomethingItems.ToList();
            return Ok(items);
        }

        [HttpPost("json")]
        public IActionResult SaveJson([FromBody] List<SomethingItem> items)
        {
            _context.SomethingItems.RemoveRange(_context.SomethingItems);
            _context.SomethingItems.AddRange(items);
            _context.SaveChanges();
            return Ok();
        }
    }

}
