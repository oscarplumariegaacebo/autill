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

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            if (_userContext.Users is null)
            {
                return NotFound();
            }
            var user = _userContext.Users.FirstOrDefault(s => s.Id == id);
            if (user is null)
            {
                return NotFound();
            }
            return user;
        }

        [HttpGet("byEmail/{Email}")]
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
        public bool PutUser([FromBody] User user)
        {
           return _userContext.Users.Where(x => x.Id == user.Id && x.Email == user.Email)
           .ExecuteUpdate(setter => setter
           .SetProperty(x => x.FullName, user.FullName)
           .SetProperty(x => x.Address, user.Address)
           .SetProperty(x => x.Nif, user.Nif)
           .SetProperty(x => x.PhoneNumber, user.PhoneNumber)
           ) > 0;
        }
    }
}
