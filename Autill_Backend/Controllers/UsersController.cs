using Autill.Data;
using Autill.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Autill.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserContext _userContext;

        public UsersController(UserContext userContext) 
        { 
            _userContext = userContext; 
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            if (_userContext.Users == null)
            {
                return NotFound();
            }
            return await _userContext.Users.ToListAsync();
        }

        [HttpGet("{Email}")]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {
            if (_userContext.Users is null)
            {
                return NotFound();
            }
            var user = _userContext.Users.FirstOrDefault(s => s.Email == email);
            if (user is null)
            {
                return NotFound();
            }
            return user;
        }

        [HttpPut]
        public async Task<ActionResult<User>> PutUser(string email, User user)
        {
            if(email != user.Email)
            {
                return BadRequest();
            }
            _userContext.Entry(user).State = EntityState.Modified;
            try
            {
                await _userContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if(!UserExists(email)) 
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

        private bool UserExists(string email) 
        {
            return (_userContext.Users?.Any(user => user.Email == email)).GetValueOrDefault();
        }
    }
}
