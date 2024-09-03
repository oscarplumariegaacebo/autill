namespace Autill.Models
{
    public class Budget
    {
        public int Id { get; set; }
        public string IdBusiness { get; set; }
        public string Name { get; set; }
        public int ClientId { get; set; }
        public string Date { get; set; }
        public string DescriptionItems { get; set; }
        public double Price { get; set; }
    }
}
