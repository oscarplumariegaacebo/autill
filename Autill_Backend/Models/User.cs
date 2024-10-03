﻿using Microsoft.AspNetCore.Identity;

namespace Autill.Models
{
    public class User : IdentityUser
    {
        public string? Address {  get; set; }
        public string? FullName {  get; set; }
        public string? Cif {  get; set; }
        public string? Logo { get; set; }
        public int? PostalCode { get; set; }
    }
}
