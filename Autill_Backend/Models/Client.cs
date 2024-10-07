namespace Autill.Models
{
    public class Client
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Nif { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Region { get; set; }
        public string Country { get; set; }
        public int PostalCode { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
    }
}
