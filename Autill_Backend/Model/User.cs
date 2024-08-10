using Microsoft.AspNetCore.Identity;

namespace Autill.Model
{
    public class User : IdentityUser
    {
        public string LoggingName { get; set; }

        public string Address { get; set; }
    }
}
