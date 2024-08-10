using Autill.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Autill.Controllers
{
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        [HttpPost("add-user")]
        public async Task<IActionResult> Register(RegisterModel model)
        {
            var user = new User()
            {
                Email = model.Email,
                LoggingName = model.LoggingName,
                PasswordHash = model.Password
            }; 

            var result = await _userManager.CreateAsync(user, user.PasswordHash);
            if(result.Succeeded)
            {
                return Ok("Registration made successfull");
            }
            else
            {
                return BadRequest("Error");
            }
            
        }
    }
}
